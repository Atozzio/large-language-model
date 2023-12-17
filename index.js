const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const { getCompletion } = require("./generate");
const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "API key",
        form: async (context) => {
          return new Form({
            fields: [
              {
                name: "backend",
                label: "Inference backend",
                type: "String",
                required: true,
                attributes: {
                  options: [
                    "OpenAI",
                    "OpenAI-compatible API",
                    "Local llama.cpp",
                  ],
                },
              },
              {
                name: "api_key",
                label: "API key",
                sublabel: "From your OpenAI account",
                type: "String",
                required: true,
                showIf: { backend: "OpenAI" },
              },

              {
                name: "model",
                label: "Model", //gpt-3.5-turbo
                type: "String",
                required: true,
                showIf: { backend: "OpenAI" },
                attributes: {
                  options: [
                    "gpt-3.5-turbo",
                    "gpt-3.5-turbo-16k",
                    "gpt-4",
                    "gpt-4-32k",
                  ],
                },
              },
              {
                name: "bearer_auth",
                label: "Bearer Auth",
                sublabel: "HTTP Header authorization with bearer token",
                type: "String",
                showIf: { backend: "OpenAI-compatible API" },
              },
              {
                name: "model",
                label: "Model",
                type: "String",
                showIf: { backend: "OpenAI-compatible API" },
              },
              {
                name: "endpoint",
                label: "Chat completions endpoint",
                type: "String",
                sublabel: "Example: http://localhost:8080/v1/chat/completions",
                showIf: { backend: "OpenAI-compatible API" },
              },
            ],
          });
        },
      },
    ],
  });
const functions = (config) => ({
  llm_generate: {
    run: async (prompt, { opts }) => {
      return await getCompletion(config, { prompt, ...opts });
    },
    isAsync: true,
    description: "Generate text with GPT",
    arguments: [{ name: "prompt", type: "String" }],
  },
});
module.exports = {
  sc_plugin_api_version: 1,
  configuration_workflow,
  functions,
};