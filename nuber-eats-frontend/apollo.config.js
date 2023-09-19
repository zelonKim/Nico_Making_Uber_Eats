module.exports = {
    client: {
        inlcudes: [".src/**/*.tsx"],
        tagName: 'gql',
        service: {
            name: "nuber-eats-backend",
            url: "http://localhost:4000/graphql"
        }
    }
}