const jwt = required (jsonwebtoken);

class usuario {
    constructor (email, nombre, password) {
        this.email = email;
        this.nombre = nombre;
        this.password = password;
    }
}

token