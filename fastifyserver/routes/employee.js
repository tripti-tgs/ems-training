
const Busboy = require('busboy');
const http = require('node:http');
const { inspect } = require('node:util');
const authMiddleware = require("../middleware/auth");
const employeeController = require("../controllers/employeeController");
const resumable = require("../resumable-node.js")("/tmp/resumable.js/");


async function onFile(part) {

// console.log(part)
  part.value = part
}

async function employeeRoutes(fastify, options) {

  fastify.register(require('@fastify/multipart'), { attachFieldsToBody: "keyValues",   preservePath: true ,onFile})

  fastify.addHook("preHandler", authMiddleware);

  fastify.post(
    "/create",
    {
      schema: {
        consumes: ['multipart/form-data'],
        body: {
          type: "object",
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
    //  console.log("helooo-------------------------------------",req.headers)
    let busboy =  Busboy({ headers: req.headers });
     busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
       console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
       file.on('data', data => {
         console.log(`File [${fieldname}] got ${data.length} bytes`);
       });
       file.on('end', () => {
         console.log(`File [${fieldname}] Finished`);
       });
     });
     busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
       console.log(`Field [${fieldname}]: value: ${inspect(val)}`);
     });
     busboy.on('finish', () => {
       console.log('Done parsing form!');
       res.writeHead(303, { Connection: 'close', Location: '/' });
       res.end();
     });
    //  req.pipe(busboy);
      // try {
      //   await resumable.post(req, async (status, filename) => {
      //     if (status === "done") {
      //       console.log("File upload completed:", filename);
      //         await employeeController.createEmployee(req, reply, filename);
      //     } else {
      //       console.log("Chunk uploaded:", filename);
      //     }
      //   });
      // } catch (err) {
      //   console.error("Error uploading file:", err);
      //   reply.status(500).send({ error: "Internal server error" });
      // }
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
