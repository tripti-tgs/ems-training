const app = require("fastify")({
  logger: true,
});

const authMiddleware = require("../middleware/auth");
const employeeController = require("../controllers/employeeController");
const { body } = require("express-validator");

const resumable = require("../resumable-node.js")("/tmp/resumable.js/");

async function employeeRoutes(fastify, options) {
  fastify.register(require("@fastify/multipart"));

  // fastify.addHook("preHandler", authMiddleware);

  fastify.post(
    "/create",
    {
      schema: {
        body: {
          // type: "object",
          required: ["name", "email", "phone", "gender", "dob", "dept_id"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "integer" },
            gender: { type: "integer" },
            dob: { type: "string", format: "date" },
            dept_id: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // let data = await req.file();
      const rawData = req.raw;
      // console.log(rawData)
      // req = {
      //   body: {
      //     ...Object.fromEntries(
      //       Object.entries(data.fields).map(([key, value]) => [
      //         key,
      //         value.value,
      //       ])
      //     ),
      //   },
      //   file: {
      //     fieldName: data.fieldname,
      //     originalFilename: data.filename,
      //     path: data.file.path,
      //     headers: {
      //       "content-disposition": `form-data; name="${data.fieldname}"; filename="${data.filename}"`,
      //       "content-type": data.mimetype,
      //     },
      //     size: data.file.bytesRead,
      //     name: data.filename,
      //     type: data.mimetype,
      //   },
      // };
      console.log(data);
      // req ={
      //   body:{},
      //   files :{
      //     file{

      //     }
      //   }
      // }
      try {
        await resumable.post(req, async (status, filename) => {
          if (status === "done") {
            console.log("File upload completed:", filename);
            await validateMiddleware(req, reply, async () => {
              await employeeController.createEmployee(req, reply, filename);
            });
          } else {
            console.log("Chunk uploaded:", filename);
          }
        });
      } catch (err) {
        console.error("Error uploading file:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // fastify.post(
  //   "/createempanddep",
  //   {
  //     schema: {
  //       body: {
  //         type: "object",
  //         required: ["name", "email", "phone", "gender", "dob", "dept_id"],
  //         properties: {
  //           name: { type: "string", source: ['body'] },
  //           email: { type: "string", format: "email", source: ['body'] },
  //           phone: { type: "string", source: ['body'] },
  //           gender: { type: "string", source: ['body'] },
  //           dob: { type: "string", format: "date", source: ['body'] },
  //           dept_id: { type: "string", source: ['body'] }
  //         }
  //       }
  //     }
  //   },
  //   async (req, reply) => {
  //     try {
  //       await resumable.post(req, async (status, filename) => {
  //         if (status === 'done') {
  //           console.log('File upload completed:', filename);

  //             await employeeController.createEmployeeAndDept(req, reply, filename);

  //         } else {
  //           console.log('Chunk uploaded:', filename);
  //         }
  //       });
  //     } catch (err) {
  //       console.error('Error uploading file:', err);
  //       reply.status(500).send({ error: 'Internal server error' });
  //     }
  //   }
  // );

  // fastify.get("/empanddep", employeeController.getEmpAndDep);

  fastify.get("/", employeeController.getAllEmployees);

  fastify.get("/:id", employeeController.getOneEmployees);

  // fastify.put(
  //   "/:id",
  //   {
  //     schema: {
  //       body: {
  //         type: "object",
  //         required: ["name", "email", "phone", "gender", "dob", "dept_id"],
  //         properties: {
  //           name: { type: "string", source: ['body'] },
  //           email: { type: "string", format: "email", source: ['body'] },
  //           phone: { type: "string", source: ['body'] },
  //           gender: { type: "string", source: ['body'] },
  //           dob: { type: "string", format: "date", source: ['body'] },
  //           dept_id: { type: "string", source: ['body'] }
  //         }
  //       }
  //     }
  //   },
  //   async (req, reply) => {
  //     try {
  //       await resumable.post(req, async (status, filename) => {
  //         if (status === 'done') {
  //           console.log('File upload completed:', filename);

  //             await employeeController.updateEmployee(req, reply, filename);

  //         } else {
  //           console.log('Chunk uploaded:', filename);
  //         }
  //       });
  //     } catch (err) {
  //       console.error('Error uploading file:', err);
  //       reply.status(500).send({ error: 'Internal server error' });
  //     }
  //   }
  // );

  // fastify.delete("/:id", employeeController.deleteEmployee);
}

module.exports = employeeRoutes;
