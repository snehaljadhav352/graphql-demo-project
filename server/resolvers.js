const users = [
    { id: "1", name: "John Doe", age: 30, isMarried: true },
    { id: "2", name: "Jane Smith", age: 25, isMarried: false },
    { id: "3", name: "Alice Johnson", age: 28, isMarried: false },
  ];
  
  const resolvers = {
    Query: {
      getUsers: () => {
        return users;
      },
      getUserById: (parent, args) => {
        const id = args.id;
        return users.find((user) => user.id === id);
      },
    },
    Mutation: {
      createUser: (parent, args) => {
        const { name, age, isMarried } = args;
        const newUser = {
          id: (users.length + 1).toString(),
          name,
          age,
          isMarried,
        };
        console.log(newUser);
        users.push(newUser);
        return newUser;
      },
      deleteUser: (parent, args) => {
        const { id } = args;
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
          throw new Error("User not found");
        }
        const [deletedUser] = users.splice(userIndex, 1);
        return deletedUser;
      },
      updateUser: (parent, args) => {
        const { id, name, age, isMarried } = args;
        const user = users.find((user) => user.id === id);
        if (!user) {
          throw new Error("User not found");
        }
        if (name !== undefined) user.name = name;
        if (age !== undefined) user.age = age;
        if (isMarried !== undefined) user.isMarried = isMarried;
        return user;
      },
    },
  };
  
  export default resolvers;
  