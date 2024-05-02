import React, { useContext, useState } from "react";
import { MyContext, MyProvider } from "./ContextAPI";

function ShowContext() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({ id:Math.floor(Math.random() * 100),name: "", age: "" });

  const contextValue = useContext(MyContext);
  console.log(contextValue);

  return (
    <div>
      <div>
        <button onClick={()=>setShow(true)}>Add User</button>
        {contextValue?.users.map((e) => (
          <p key={e.id}>
            {e.id}: {e.name},{e.age}
            <button onClick={() => contextValue.removeUser(e.id)}>
              Delete user
            </button>
          </p>
        ))}
      </div>

      <div>
        {show && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                contextValue.addUser(user);
                setUser({id:Math.floor(Math.random() * 100),name: "", age: ""})
                setShow(false);
              }}
            >
                
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="number"
                value={user.age}
                onChange={(e) => setUser({ ...user, age: e.target.value })}
                placeholder="Age"
              />
              <button type="submit">Add User</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowContext;
