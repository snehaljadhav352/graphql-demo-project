import { useEffect, useState } from "react";
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

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
       id
      name
      age
      isMarried
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $age: Int, $isMarried: Boolean) {
    updateUser(id: $id, name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;


function App() {
  const [choosenUser, setChoosenUser] = useState(null)
  const [newUser, setNewUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const {data: getUsersData,error: getUsersError,loading: getUsersLoading,} = useQuery(GET_USERS);
  const { data: getUserByIdData, loading: getUserByIdLoading } = useQuery(
    GET_USER_BY_ID,
    {
    variables: { id: choosenUser },
    skip: !choosenUser, // Skip query if no ID is selected
    }
  );
  
  const [deleteUser] = useMutation(DELETE_USER)
  const [updateUser] = useMutation(UPDATE_USER);
  const [createUser] = useMutation(CREATE_USER);

  if (getUsersLoading) return <p> Data loading...</p>;

  if (getUsersError) return <p> Error: {error.message}</p>;

    // Filter users based on the search term
  
    const filteredUsers = getUsersData.getUsers.filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchTermLower) ||
        user.age.toString().includes(searchTermLower)
      );
    });
 

  const handleCreateUser = async () => {
   if(!isUpdating){
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
  }else{
    try {
      await updateUser({
        variables: {
          id: newUser.id,
          name: newUser.name,
          age: Number(newUser.age),
          isMarried: newUser.isMarried || false,
        },
        refetchQueries: [{ query: GET_USERS }],
      });
      console.log("User updated successfully.");
      setNewUser({});
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
}


  const handleDeleteUser = async (id) => {
    try {
      await deleteUser({
        variables: { id },
        refetchQueries: [{ query: GET_USERS }], // Refresh the user list after deletion
      });
      console.log("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleChoosenUser = (id) => {
    setChoosenUser(id);
  };


const handleUpdateUser = async (user) => {
  setIsUpdating(true);
  setNewUser(user);
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
        <button className="submit-btn" onClick={handleCreateUser}> 
          {isUpdating ? "Update User" : "Create User"}</button>
      </div>

      <div className="chosen-user">
        {getUserByIdLoading ? (
          <p> Loading user...</p>
        ) : (
          choosenUser &&(
            <>
            <h1> Chosen User: </h1>
            <p>{getUserByIdData.getUserById.name}</p>
            <p>{getUserByIdData.getUserById.age}</p>
          </>
          )
        )}
      </div>

      <h1> Users</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or age..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="users-container">
        {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div className="user-card" key={user.id}>
            <span onClick={()=>handleChoosenUser(user.id)}>choose</span>
            <span onClick={() => handleUpdateUser(user)}>update</span>
            <span onClick={()=>{handleDeleteUser(user.id)}}>delete</span>
            <p> id: {user.id}</p>
            <p> Name: {user.name}</p>
            <p> Age: {user.age}</p>
            <p> Is this user married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
          ))
        ): (
          <p>No users found.</p>
        )}
      </div>
    </>
  );
}

export default App;
