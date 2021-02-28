const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const Note = require("../models/note");
const User = require("../models/user");
const {
  initialNotes,
  initialUser,
  getNonExistingNoteId,
  getAllNotes,
  getAllUsers,
} = require("./test-helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany();
  const passwordHash = await bcrypt.hash(initialUser.password, 10);
  const user = new User({ username: initialUser.username, passwordHash });
  await user.save();

  await Note.deleteMany();
  for (const note of initialNotes) {
    const noteObject = new Note({ ...note, user: user._id });
    await noteObject.save();
  }
});

describe("when there is initially some notes saved", () => {
  test("notes are returned as json", async () => {
    const res = await api.get("/api/notes");
    expect(res.statusCode).toBe(200);
    expect(res.get("Content-Type")).toMatch(/application\/json/);
  });

  test("all notes are returned", async () => {
    const res = await api.get("/api/notes");
    expect(res.body).toHaveLength(initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const res = await api.get("/api/notes");
    const contents = res.body.map((note) => note.content);
    expect(contents).toContain(initialNotes[1].content);
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await getAllNotes();
      const noteToView = notesAtStart[0];
      const res = await api.get(`/api/notes/${noteToView.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.get("Content-Type")).toMatch(/application\/json/);
      const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
      expect(res.body).toEqual(processedNoteToView);
    });

    test("fails with statuscode 404 if note does not exist", async () => {
      const validNonexistingId = await getNonExistingNoteId();
      const res = await api.get(`/api/notes/${validNonexistingId}`);
      expect(res.statusCode).toBe(404);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";
      const res = await api.get(`/api/notes/${invalidId}`);
      expect(res.statusCode).toBe(400);
    });
  });
});

describe("addition of a new note", () => {
  test("succeeds with valid data", async () => {
    const usersAtStart = await getAllUsers();
    const existingUser = usersAtStart[0];
    const loginRes = await api
      .post("/api/login")
      .send({ username: existingUser.username, password: "sekret" });
    const { token } = loginRes.body;
    const validNote = {
      content: "HTML is nice, but React is better!",
      date: new Date(),
      user: existingUser.id,
    };
    const res = await api
      .post("/api/notes")
      .send(validNote)
      .set("authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    expect(res.get("Content-Type")).toMatch(/application\/json/);
    const notesAtEnd = await getAllNotes();
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
    const contents = notesAtEnd.map((note) => note.content);
    expect(contents).toContain(validNote.content);
  });

  test("fails with statuscode 400 if data is invalid", async () => {
    const usersAtStart = await getAllUsers();
    const existingUser = usersAtStart[0];
    const loginRes = await api
      .post("/api/login")
      .send({ username: existingUser.username, password: "sekret" });
    const { token } = loginRes.body;
    const invalidNote = { date: new Date(), user: existingUser.id };
    const res = await api
      .post("/api/notes")
      .send(invalidNote)
      .set("authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    const notesAtEnd = await getAllNotes();
    expect(notesAtEnd).toHaveLength(initialNotes.length);
  });
});

describe("deletion of a note", () => {
  test("succeeds with statuscode 204 if id is valid", async () => {
    const notesAtStart = await getAllNotes();
    const noteToDelete = notesAtStart[0];
    const res = await api.delete(`/api/notes/${noteToDelete.id}`);
    expect(res.statusCode).toBe(204);
    const notesAtEnd = await getAllNotes();
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1);
    const contents = notesAtEnd.map((note) => note.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany();
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("users are returned as json", async () => {
    const res = await api.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.get("Content-Type")).toMatch(/application\/json/);
  });

  test("all users are returned", async () => {
    const usersAtStart = await getAllUsers();
    const res = await api.get("/api/users");
    expect(res.body).toHaveLength(usersAtStart.length);
  });

  describe("addition of a new user", () => {
    test("succeeds with a fresh username", async () => {
      const usersAtStart = await getAllUsers();
      const validUser = {
        username: "mzelinka",
        name: "Marek Zelinka",
        password: "123456",
      };
      const res = await api.post("/api/users").send(validUser);
      expect(res.statusCode).toBe(201);
      expect(res.get("Content-Type")).toMatch(/application\/json/);
      const usersAtEnd = await getAllUsers();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
      const usernames = usersAtEnd.map((user) => user.username);
      expect(usernames).toContain(validUser.username);
    });

    test("fails with statuscode 400 if username already exists", async () => {
      const usersAtStart = await getAllUsers();
      const existingUser = usersAtStart[0];
      const invalidUser = {
        username: existingUser.username,
        name: "Marek Zely Zelinka",
        password: "123456",
      };
      const res = await api.post("/api/users").send(invalidUser);
      expect(res.statusCode).toBe(400);
      const usersAtEnd = await getAllUsers();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
