"use strict";
const Boom = require("@hapi/boom");
const users = require("../models/index").users;

async function createUser(req, h) {
  let result;
  try {
    result = await users.create(req.payload);
    console.log(`Usuario registrado`);
  } catch (error) {
    console.error(error);
    // return h.response("Problemas creando el usuario").code(500);
    return h.view("register", {
      title: "Registro",
      error: "Error creando el usuario",
    });
  }
  // return h.response(`Usuario creado ID: ${result}`);
  return h.view("register", {
    title: "Registro",
    success: "Usuario creado exitosamente",
  });
}

function logout(req, h) {
  return h.redirect("/login").unstate("user");
}

async function validateUser(req, h) {
  let result;
  try {
    result = await users.validateUser(req.payload);
    if (!result) {
      // return h.response("Email y/o contraseña incorrecta").code(401);
      return h.view("login", {
        title: "Login",
        error: "Email y/o contraseña incorrecta",
      });
    }
  } catch (error) {
    console.error(error);
    // return h.response("Problemas validando el usuario").code(500);
    return h.view("login", {
      title: "Login",
      error: "Problemas validando el usuario",
    });
  }

  return h.redirect("/").state("user", {
    name: result.name,
    email: result.email,
  });
}

function failValidation(req, h, err) {
  const templates = {
    "/create-user": "register",
    "/validate-user": "login",
    "/create-question": "ask",
  };
  return h
    .view(templates[req.path], {
      title: "Error de validación",
      error: "Por favor complete los campos requeridos",
    })
    .code(400)
    .takeover();
  // return Boom.badRequest("Falló la validación", req.payload);
}

module.exports = {
  createUser: createUser,
  failValidation: failValidation,
  logout: logout,
  validateUser: validateUser,
};
