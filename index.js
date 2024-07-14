const express = require('express');
const bcrypt = require('bcrypt')
require('./db/config');
const User = require('./db/signUpSchema');
const Room = require('./db/roomLocatorSchema')
const foundHub = require('./db/foundHubSchema')
const Event = require('./db/addEventSchema')
const Club = require('./db/societySchema')
const addGames = require('./db/addGamesSchema')
const allTeams = require('./db/teamRegisterSchema')
const teamSchedule = require('./db/scheduleSchema')
const Announcement = require('./db/anouncementSchema')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use(cors());




// ============================================
// server verification
// ============================================
app.get('/', (req, resp) => {
    resp.send('Congratulations! Guide-Plus Server is running...')
})
// ============================================
// Registration API
// ============================================
app.post('/signup', async (req, resp) => {
    const { name, rollNo, email, department, gender, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, rollNo, email, gender, department, password: hashedPassword });
        await newUser.save();

        resp.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            // 11000 is the error code for duplicate key
            resp.status(400).send({ error: 'Email already exists' });
        } else {
            resp.status(500).send({ error: 'Internal server error' });
        }
    }
})

// ============================================
// Login APi
// ============================================
app.post('/login', async (req, resp) => {

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return resp.status(400).send({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (isMatch) {
            resp.send(user);
        }
        else {
            return resp.status(400).send({ message: 'Invalid credentials' });
        }

        //   resp.json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: 'Server error' });
    }

})
// ============================================
// roomLocator insert API
// ============================================
app.post('/roomLocator/roomInsert', async (req, resp) => {
    // console.log(req.body)
    let data = new Room(req.body);
    let result = await data.save()
    if (result) {
        resp.send({ result: 'Room Added Successfullt' })
    }
    else {
        resp.send({ error: 'Failed to Add Room!' })
    }
})
// ============================================
// roomLocator Search API
// ============================================
app.post('/roomLocator/searchRoom', async (req, resp) => {
    if (req.body.roomNo) {
        let data = await Room.findOne(req.body)
        // console.log(data)
        if (data) {
            resp.send(data)
        }
        else {
            resp.send({ result: 'Location to this room has not been added yet!' })
        }
    }
    else {
        resp.send({ result: 'Please enter a valid number' })
    }
})

// ============================================
// roomLocator Delete Room API
// ============================================
app.delete('/roomLocator/deleteRoom', async (req, resp) => {
    // console.log(req.body.roomNo)
    let data = await Room.deleteOne({ roomNo: req.body.roomNo })
    if (data.deletedCount === 1) {
        resp.send(data)
    }
    else {
        resp.send({ message: 'Failed to Delete Room' })
    }
    console.log(data);
})


// ============================================
// FoundHub API to Add Post
// ============================================




app.post('/foundHub/addPost', async (req, resp) => {
    console.log(req.body)
    try {
        let data = new foundHub(req.body);
        data = await data.save();
        console.log(data);
        resp.status(201).json(data); // Send a 201 Created status with the JSON response
    } catch (error) {
        console.error('Error saving post:', error);
        resp.status(500).json({ message: 'Internal Server Error', error: error.message }); // Send a 500 Internal Server Error status with an error message
    }
});


// ============================================
// FoundHub ViewAll API
// ============================================
app.get('/foundHub', async (req, resp) => {
    let data = await foundHub.find({})
    console.log(data);
    if (data) {
        resp.send(data)
    }
    else {
        resp.send({ result: 'No posts have been made Found' })
    }
})
// ============================================
// FoundHub API for All Found Items
// ============================================
app.get('/foundHub/foundPosts', async (req, resp) => {
    let data = await foundHub.find({ $or: [{ status: 'Found' }, { status: 'found' }, { status: 'FOUND' }, { status: 'found ' }, { status: 'FOUND ' }, { status: 'Found ' }] })
    // console.log(data);
    if (data) {
        resp.send(data)
    }
    // else {
    //     resp.send({ result: 'No posts have been made Found' })
    // }
})


// ==================================
// FoundHub API for All Lost Items
// ==================================
app.get('/foundHub/lostPosts', async (req, resp) => {
    let data = await foundHub.find({ $or: [{ status: 'Lost' }, { status: 'lost' }, { status: 'LOST' }, { status: 'LOST ' }, { status: 'lost ' }, { status: 'Lost ' }] })
    // console.log(data);
    if (data) {
        resp.send(data)
    }
    // else {
    //     resp.send({ result: 'No posts have been made Found' })
    // }
})

// ===================================
// FoundHub API for Deleting Posts
// ===================================
app.delete('/foundHub/deletePosts', async (req, resp) => {
    console.log(req.body);
    let data = await foundHub.deleteOne({ _id: req.body.inputId })

    resp.send(data);
})



// ===================================
// fetch all Events API
// ===================================
app.get('/allEvents', async (req, resp) => {
    let data = await Event.find({})
    if (data) {
        resp.send(data)
    }
    else {
        resp.send({ result: 'No Results Found' })
    }
})

// ===================================
// ADD Events API
// ===================================
app.post('/addEvents', async (req, resp) => {
    let data = new Event(req.body)
    data = await data.save()
    resp.send(data)
})

// ===================================
// Update Events API
// ===================================
app.put('/eventsUpdate', async (req, resp) => {
    let data = await Event.updateOne({ _id: req.body.eventId }, { $set: req.body });
    console.log(data);
    if (data) {
        resp.send(data)
    }
    else {
        resp.send({ result: 'Match Not Found.' })
    }
})

// ===================================
// DELETE Events API
// ===================================
app.delete('/eventsDelete', async (req, resp) => {
    console.log(req.body);
    let data = await Event.deleteOne({ _id: req.body.eventId })
    resp.send(data);
})


// ===================================
// Add Clubs and Societies API
// ===================================
app.post('/addClub', async (req, resp) => {
    let data = new Club(req.body);
    data = await data.save()
    if (data) {
        resp.send(data)
    }
    else {
        resp.send({ result: 'Failed to add Club' })
    }
})

// ===================================
// View Clubs and Societies API
// ===================================
app.get('/allClubs', async (req, resp) => {
    let data = await Club.find({})
    if (data) {
        resp.send(data)
    }
    else {
        resp.send({ result: 'No Clubs Found' })
    }
}
)

// ===================================
// Add Games API
// ===================================
app.post('/sports/addGames', async (req, resp) => {
    let data = new addGames(req.body)
    data = await data.save()
    resp.send(data)
})


// ===================================
// fetch all Games API
// ===================================
app.get('/sports/allGames', async (req, resp) => {
    let data = await addGames.find({})
    resp.send(data)
})

// ===================================
// fetch all Games for limit 
// ===================================
app.get('/sports/fetchGames/:id', async (req, resp) => {
    console.log(req.params.id);
    let data = await addGames.findOne({ _id: req.params.id })
    console.log(data);
    resp.send(data)
})

// ===================================
// Delete Games API
// ===================================
app.delete('/deleteGames/:id', async (req, resp) => {
    // console.log(req.params.id);
    let data = await addGames.deleteOne({ _id: req.params.id })
    resp.send(data);
})

// ===================================
// Register Teams API
// ===================================
app.post('/sports/registerTeams', async (req, resp) => {

    try {
        const data = new allTeams(req.body);
        await data.save();
        resp.status(201).send({ message: 'Team registered successfully' });
    }
    catch (error) {
        if (error.code === 11000) {
            // 11000 is the error code for duplicate key
            resp.status(400).send({ error: 'Team Name already exists' });
        } else {
            resp.status(500).send({ error: 'Internal server error' });
        }
    }
})

// ===================================
// Show All Registered Teams API
// ===================================
app.get('/sports/allTeams', async (req, resp) => {
    let data = await allTeams.find({})
    resp.send(data)
    console.log(data);
})

// ===================================
// Show All Registered Teams API
// ===================================
app.delete('/sports/deleteTeam/:teamName', async (req, resp) => {
    console.log(req.params.teamName);
    let data = await allTeams.deleteMany({ teamName: req.params.teamName })
    // console.log(data);
    resp.send(data)
    // resp.send(data)
})

// ===================================
// Show All Registered Teams API
// ===================================
app.get('/sports/fetchTeams', async (req, resp) => {
    let data = await allTeams.find({})
    resp.send(data)
})

// ===================================
// Show All Registered Teams API
// ===================================
app.post('/sports/teamSchedule', async (req, resp) => {
    let data = req.body;
    console.log(data);
    try {
        // Iterate through the array and save each schedule entry
        for (const entry of data) {
            const { dateTime, game, teamA, teamB } = entry;

            // Create a new Schedule document
            const schedule = new teamSchedule({
                dateTime,
                game,
                teamA,
                teamB
            });
            // Save the document to the database
            await schedule.save();
        }

        // Respond with success message
        resp.status(200).send({ message: 'Data saved successfully' });
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error saving data:', error);
        resp.status(500).send({ message: 'Error saving data' });
    }
})

// ===================================
// Fetch All Scheduled Teams API
// ===================================
app.get('/sports/allSchedules', async (req, resp) => {
    let data = await teamSchedule.find({})
    console.log(data);
    resp.send(data)
})

// ===================================
// Add Announcement API
// ===================================
app.post('/announcement', async (req, resp) => {
    try {
        let data = new Announcement(req.body);
        data = await data.save();

        console.log(data);

        // Send a positive response
        resp.status(201).send({
            message: 'Announcement created successfully',
            data: data
        });
    } catch (error) {
        console.error(error);

        // Send an error response
        resp.status(500).send({
            message: 'An error occurred while creating the announcement',
        });
    }
})

// ===================================
// Add Announcement API
// ===================================
app.get('/fetchAnnouncements', async (req, resp) => {
    let data = await Announcement.find({})
    // console.log(data);
    resp.send(data)
})

// ===================================
// DELETE Announcement API
// ===================================
app.delete('/deleteAnnouncement', async (req, resp) => {
    let data = await Announcement.deleteOne({ _id: req.body.inputId })
    console.log(data);
    resp.send(data)
})


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})