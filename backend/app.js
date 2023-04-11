const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`
    type Account {
        utorid: String! @unique
        email: String!
        name: String!
        accessGranted: Boolean!
        theme: String!
        language: String!
        groups: [Group!]! @relationship(type: "MEMBER", direction: OUT)
    }
    
    type Group {
        name: String! @unique
        members: [Account!]! @relationship(type: "MEMBER", direction: IN)
        requests: [Request!]! @relationship(type: "REQUEST", direction: OUT)
        manager: Account! @relationship(type: "MANAGER", direction: OUT)
        creator: Account! @relationship(type: "CREATOR", direction: OUT)
    }
    
    type Request {
        status: String!
        group: Group! @relationship(type: "REQUEST", direction: IN)
        owner: Account! @relationship(type: "OWNER", direction: OUT)
        approver: Account! @relationship(type: "APPROVER", direction: OUT)
        tcardapprover: Account! @relationship(type: "TCARDAPPROVER", direction: OUT)
        start_date: DateTime!
        end_date: DateTime!
        description: String
        title: String!
        reason: String
    }
`;

const driver = neo4j.driver(
    "bolt://neo4j:7687",
    neo4j.auth.basic("neo4j", "password")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
      schema,
  });

  server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
  });
})