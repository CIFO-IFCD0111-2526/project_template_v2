
// Ruta-> para la pagina de Tareas
// GET /private -> /private -> private.html
server.get("/private", authPage, (request,response) => {
    response.sendFile(path.join(__dirname, '..' , 'front' , 'private.html'));
});

// Ruta-> Pagina de tareas (Privada)
// GET /account -> Sirve front/account.html
server.get("/account", authPage, (request,response) =>{
    response.sendFile(path.join(__dirname, '..' , 'front' , 'me.html'));
} );