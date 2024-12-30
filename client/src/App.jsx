import { useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);
  const { data: getUserByIdData, loading: getUserByIdLoading } = useQuery(
    GET_USER_BY_ID,
    {
      variables: { id: "2" },
    }
  );

  const [createUser] = useMutation(CREATE_USER);

  if (getUsersLoading) return <p> Data loading...</p>;

  if (getUsersError) return <p> Error: {error.message}</p>;

  const handleCreateUser = async () => {
    console.log(newUser);
    createUser({
      variables: {
        id:newUser.id,
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
      refetchQueries: [{ query: GET_USERS }],
    });
    setNewUser('');
  };

  return (
    <>
      <div className="form">
        <input
          placeholder="Name..."
          value={newUser.name || ""}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Age..."
          value={newUser.age || ""}
          type="number"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button className="submit-btn" onClick={handleCreateUser}> Create User</button>
      </div>

      <div className="chosen-user">
        {getUserByIdLoading ? (
          <p> Loading user...</p>
        ) : (
          <>
            <h1> Chosen User: </h1>
            <p>{getUserByIdData.getUserById.name}</p>
            <p>{getUserByIdData.getUserById.age}</p>
          </>
        )}
      </div>

      <h1> Users</h1>
      <div className="users-container">
        {" "}
        {getUsersData.getUsers.map((user) => (
          <div className="user-card" key={user.id}>
      <p> id: {user.id}</p>
            <p> Name: {user.name}</p>
            <p> Age: {user.age}</p>
            <p> Is this user married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}{" "}
      </div>
    </>
  );
}

export default App;
