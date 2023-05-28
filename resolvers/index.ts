const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");
const { finished } = require("stream/promises");
const path = require("path");

export const resolvers = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: async (parent: any, { file }: any) => {
      console.log('file', file);
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      const UPLOAD_DIR_NAME = "uploads";

      
      const pathName = path.join(__dirname, `../${UPLOAD_DIR_NAME}/${filename}`);
      const out = require("fs").createWriteStream(pathName);
      stream.pipe(out);
      await finished(out);

      return { filename, mimetype, encoding };
    },
  },
};
