const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const {
  initialNotes,
  getNonExistingNoteId,
  getAllNotes,
} = require("./test-helper");

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany();
  for (const note of initialNotes) {
    const noteObject = new Note(note);
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
    const validNote = {
      content: "HTML is nice, but React is better!",
      date: new Date(),
    };
    const res = await api.post("/api/notes").send(validNote);
    expect(res.statusCode).toBe(201);
    expect(res.get("Content-Type")).toMatch(/application\/json/);
    const notesAtEnd = await getAllNotes();
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
    const contents = notesAtEnd.map((note) => note.content);
    expect(contents).toContain(validNote.content);
  });

  test("fails with statuscode 400 if data is invalid", async () => {
    const invalidNote = { date: new Date() };
    const res = await api.post("/api/notes").send(invalidNote);
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

afterAll(() => {
  mongoose.connection.close();
});
