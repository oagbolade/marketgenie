const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Market = require("../models/Market");
const {FileUpload} = require("./types");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLString },
    // photo: { type: GraphQLString }, // File Upload Coming Soon
    client: {
      type: UserType,
      resolve(parent: { clientId: any }, args: any) {
        return User.findById(parent.clientId);
      },
    },
  }),
});

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: "CustomerName",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    isActive: { type: GraphQLString },
    age: { type: GraphQLString },
    // photo: { type: GraphQLString }, // File Upload Coming Soon
    client: {
      type: CustomerType,
      resolve(parent: { clientId: any }, args: any) {
        return Market.findById(parent.clientId);
      },
    },
  }),
});

// Market Type
const MarketType = new GraphQLObjectType({
  name: "MarketName",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    population: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent: any, args: any) {
        const users = User.findAll();
        return users;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent: any, args: { id: any }) {
        return User.findById(args.id);
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parent: any, args: any) {
        const customers = Customer.findAll();
        return customers;
        console.log(customers.every((user: any) => user instanceof Customer)); // true
        console.log("All users:", JSON.stringify(customers, null, 2));
        return Customer.find();
      },
    },
    customer: {
      type: CustomerType,
      args: { id: { type: GraphQLID } },
      resolve(parent: any, args: { id: any }) {
        return Customer.findById(args.id);
      },
    },
    markets: {
      type: new GraphQLList(MarketType),
      resolve(parent: any, args: any) {
        return Market.find();
      },
    },
    market: {
      type: MarketType,
      args: { id: { type: GraphQLID } },
      resolve(parent: any, args: { id: any }) {
        return Market.findById(args.id);
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add a customer
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        isActive: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLString) },
        // clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(
        parent: any,
        args: {
          name: any;
          isActive: any;
          age: any;
          // clientId: any;
          address: any;
        }
      ) {
        const customerData = {
          name: args.name,
          isActive: args.isActive,
          address: args.address,
          age: args.age,
          // clientId: args.clientId,
        };

        const customer = Customer.create(customerData);
        console.log("customer's auto-generated ID:", customer.id);
        return customer;
      },
    },
    // Add a user
    registerUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(
        parent: any,
        args: {
          name: any;
          email: any;
          password: any;
        }
      ) {
        try {
          const existingUser = await User.findOne({ email: args.email });
          if (existingUser) {
            throw new Error("User exists already.");
          }

          const hashedPassword = await bcrypt.hash(args.password, 12);

          const userData = {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          };

          const user = await User.create(userData);
          console.log("user's auto-generated ID:", user.id);
          return user;
        } catch (err) {
          throw err;
        }
      },
    },
    // User Login
    loginUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(
        parent: any,
        args: {
          email: any;
          password: any;
        }
      ) {
        try {
          const existingUser = await User.findOne({ email: args.email });
          if (!existingUser) {
            throw new Error("User does not exist.");
          }

          const isEqual = await bcrypt.compare(
            args.password,
            existingUser.password
          );

          if (!isEqual) {
            throw new Error("Password is incorrect!");
          }

          const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            "secret",
            {
              expiresIn: "1h",
            }
          );

          return {
            name: existingUser.name,
            userId: existingUser.id,
            token: token,
            tokenExpiration: 1,
          };
        } catch (err) {
          throw err;
        }
      },
    },

    // Upload file
    uploadFile: {
      type: FileUpload,
      // args: {
      //   name: { type: GraphQLNonNull(GraphQLString) },
      //   email: { type: GraphQLNonNull(GraphQLString) },
      //   phone: { type: GraphQLNonNull(GraphQLString) },
      // },
      resolve(parent: any, args: { file: any }) {
        console.log(args.file);

        return args.file;
      },
    },

    // Add a client
    // addMarket: {
    //   type: MarketType,
    //   args: {
    //     name: { type: GraphQLNonNull(GraphQLString) },
    //     email: { type: GraphQLNonNull(GraphQLString) },
    //     phone: { type: GraphQLNonNull(GraphQLString) },
    //   },
    //   resolve(parent: any, args: { name: any; email: any; phone: any }) {
    //     const client = new Market({
    //       name: args.name,
    //       email: args.email,
    //       phone: args.phone,
    //     });

    //     return client.save();
    //   },
    // },
    // // Delete a client
    // deleteMarket: {
    //   type: MarketType,
    //   args: {
    //     id: { type: GraphQLNonNull(GraphQLID) },
    //   },
    //   resolve(parent: any, args: { id: any }) {
    //     Customer.find({ clientId: args.id }).then((projects: any[]) => {
    //       projects.forEach((project: { deleteOne: () => void }) => {
    //         project.deleteOne();
    //       });
    //     });

    //     return Market.findByIdAndRemove(args.id);
    //   },
    // },
    // // Delete a project
    // deleteCustomer: {
    //   type: CustomerType,
    //   args: {
    //     id: { type: GraphQLNonNull(GraphQLID) },
    //   },
    //   resolve(parent: any, args: { id: any }) {
    //     return Customer.findByIdAndRemove(args.id);
    //   },
    // },
    // // Update a project
    // updateCustomer: {
    //   type: CustomerType,
    //   args: {
    //     id: { type: GraphQLNonNull(GraphQLID) },
    //     name: { type: GraphQLString },
    //     description: { type: GraphQLString },
    //     status: {
    //       type: new GraphQLEnumType({
    //         name: "CustomerStatusUpdate",
    //         values: {
    //           new: { value: "Not Started" },
    //           progress: { value: "In Progress" },
    //           completed: { value: "Completed" },
    //         },
    //       }),
    //     },
    //   },
    //   resolve(
    //     parent: any,
    //     args: { id: any; name: any; description: any; status: any }
    //   ) {
    //     return Customer.findByIdAndUpdate(
    //       args.id,
    //       {
    //         $set: {
    //           name: args.name,
    //           description: args.description,
    //           status: args.status,
    //         },
    //       },
    //       { new: true }
    //     );
    //   },
    // },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
