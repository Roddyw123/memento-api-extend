const fastify = require('fastify')();
const db = require("../../utilities/db");  
const axios = require('axios');

fastify.get('/v2/history/get_actions', async (request, reply) => {


    const actions = await fetchMementoActions(request.query);

   
    reply.send({
        actions: actions,
        total: actions.length
    });
});

async function fetchMementoActions(query) {
    
    const result = await db.execute('YOUR QUERY HERE');

}

