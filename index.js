const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Temporary memory OTP store karne ke liye (Real verification pipeline)
const otpCache = new Map();

//  STEP 1: MONGODB DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/studyshare')
  .then(() => console.log(' Local MongoDB successfully connected!'))
  .catch((err) => console.error('Database connection crash error:', err));


//  STEP 2: DATABASE MODELS (SCHEMAS)
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  semester: { type: String, default: "1st Sem" }, 
  branch: { type: String, default: "CSE" },      
  fileName: { type: String, default: "attachment.pdf" }
});
const Note = mongoose.model('Note', NoteSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'user' },            
  planStatus: { type: String, default: 'Free Tier' }, // Free Tier, Basic, Pro, Plus
  joinedAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);


// STEP 3: AUTHENTICATION PIPELINE (DIRECT & OTP SUPPORTED)

// A. Direct Signup Route (Sync with Frontend Form Actions)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email pehle se registered hai! Login karo." });
    }

    const userRole = (email === "admin@gmail.com") ? "admin" : "user";

    const newUser = new User({ 
      name, 
      email, 
      password, 
      role: userRole, 
      planStatus: 'Free Tier' 
    });
    await newUser.save();

    res.json({ success: true, message: "Account successfully created in MongoDB!", user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: "Account building failed: " + err.message });
  }
});

// B. Sign up OTP generation pipeline
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email pehle se registered hai! Login karo." });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpCache.set(email, generatedOtp);
    
    console.log(`=========================================`);
    console.log(` SYSTEM OTP GENERATED FOR: ${email}`);
    console.log(` CODE: ${generatedOtp}`);
    console.log(`=========================================`);

    res.json({ success: true, message: "Verification OTP generated inside server terminal!" });
  } catch (err) {
    res.status(500).json({ error: "OTP pipeline failure: " + err.message });
  }
});

// C. Verify OTP and Create Account
app.post('/api/auth/verify-and-signup', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const correctOtp = otpCache.get(email);
    if (!correctOtp || correctOtp !== otp) {
      return res.status(400).json({ error: "Galt OTP ya validation code expire ho gaya hai!" });
    }

    const userRole = (email === "admin@gmail.com") ? "admin" : "user";

    const newUser = new User({ 
      name, 
      email, 
      password, 
      role: userRole, 
      planStatus: 'Free Tier' 
    });
    await newUser.save();

    otpCache.delete(email); 
    res.json({ success: true, message: "Email completely verified! Account created.", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Account building failed: " + err.message });
  }
});

// D. STANDARD AUTHENTICATED LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, error: "Sahi email ya password daalo!" });
    }

    res.json({ success: true, message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Login mein error aaya: " + err.message });
  }
});


// 📑 STEP 4: NOTES PIPELINE ROUTES (FIX: DYNAMIC SEARCH ENGINE ADDED)
app.get('/api/notes', async (req, res) => {
  try {
    const { search, semester, branch } = req.query;
    let queryFilter = {};

    // Filter Logic Integration
    if (semester) {
      queryFilter.semester = semester;
    }
    if (branch) {
      queryFilter.branch = branch;
    }
    if (search) {
      // Title ya description me se kahin bhi match hone par fetch karega (case-insensitive)
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(queryFilter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { title, description, fileName, semester, branch } = req.body;
    const newNote = new Note({
      title,
      description,
      fileName,
      semester: semester || "1st Sem",
      branch: branch || "CSE"
    });
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Note deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 💳 STEP 5: SUBSCRIPTION UPGRADE PIPELINE
app.post('/api/payment/subscribe', async (req, res) => {
  try {
    const { userId, planName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { planStatus: planName },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json({ success: true, message: `Successfully upgraded to ${planName}!`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Subscription activation crash: " + err.message });
  }
});


// 👑 STEP 6: ADMIN CONTROL PIPELINE ROUTES
app.get('/api/admin/seed-users', async (req, res) => {
  try {
    await User.deleteMany({}); 
    const dummyData = [
      { name: "Admin Controller", email: "admin@gmail.com", password: "admin", role: "admin", planStatus: "Plus" },
      { name: "Yuvraj Chaturvedi", email: "yuvraj.cse@mp.gov.in", password: "123", role: "user", planStatus: "Plus" },
      { name: "Amit Sharma", email: "amit.engineering@gmail.com", password: "123", role: "user", planStatus: "Pro" },
      { name: "Rahul Verma", email: "rahul99@outlook.com", password: "123", role: "user", planStatus: "Free Tier" }
    ];
    await User.insertMany(dummyData);
    
    await Note.deleteMany({});
    await Note.insertMany([
      { title: "Yuvraj CSE Notes", description: "Complete Data Structures Questions", semester: "1st Sem", branch: "CSE", fileName: "dsa.pdf" },
      { title: "Maths 2 PYQs", description: "Engineering Mathematics previous year papers", semester: "2nd Sem", branch: "CSE", fileName: "maths.pdf" },
      { title: "Analog Electronics Notes", description: "Important questions module 1 and 2", semester: "3rd Sem", branch: "ECE", fileName: "analog.pdf" },
      { title: "Operating Systems", description: "Process Management and Deadlocks", semester: "4th Sem", branch: "CSE", fileName: "os.pdf" }
    ]);

    res.send(" Test Database cleared and updated with fresh structured data!");
  } catch (err) {
    res.status(500).send("Seeding failed: " + err.message);
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const allUsers = await User.find({}).sort({ joinedAt: -1 });
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Users data fetch failed." });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User banned successfully." });
  } catch (err) {
    res.status(500).json({ error: "User deletion failed." });
  }
});


//  STEP 7: RUN SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` SERVER RUNNING SUCCESSFULLY ON PORT: ${PORT}   `);
  console.log(`=================================================`);
});
