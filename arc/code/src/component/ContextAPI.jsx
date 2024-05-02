import React, { useState } from "react";

const MyContext = React.createContext();

const MyProvider = ({ children }) => {
  const [users, setUsers] = useState([
    { id: 1, name: "Jack", age: 25 },
    { id: 2, name: "Tom", age: 45 },
    { id: 3, name: "Sam", age: 34 }
  ]);



  const addUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const removeUser = (userID) => {
    setUsers(users.filter((user) => user.id !== userID));
  };

  return (
    <MyContext.Provider value={{ users, addUser, removeUser }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };
