// interfaces

interface User {
  id: number;
  email: string;
  password: string;
}

// main code
const fakeDB: User[] = [
  {
    id: 0,
    email: "mayoublaise@gmail.com",
    password: "$2a$10$msUn7c6pGj3xqc36LuRpeeRGfTxVYmUciXqlS2KSNTNQavEjAyTr2", // password: test
  },
];

export default fakeDB;
fakeDB.push();
