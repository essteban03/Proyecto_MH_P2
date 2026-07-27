let todosPaises = [];


async function cargarPaises() {
    const lista = document.getElementById('lista-paises');
    const inputBusqueda = document.getElementById('buscar-pais');

    if (!lista) return;

    try {
        
        if (inputBusqueda) inputBusqueda.placeholder = 'Cargando países...';

        const respuesta = await fetch('https://countries.dev/api/countries');

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la lista de países');
        }

        todosPaises = await respuesta.json();

        
        mostrarPaises(todosPaises);

        if (inputBusqueda) inputBusqueda.placeholder = 'Buscar país...';

    } catch (error) {
        console.error('Error cargando países:', error);
        if (lista) {
            lista.innerHTML = '<li class="error-paises">Error al cargar países. Verifica tu conexión.</li>';
        }
        if (inputBusqueda) inputBusqueda.placeholder = 'Error al cargar países';
    }
}


function mostrarPaises(paises) {
    const lista = document.getElementById('lista-paises');
    if (!lista) return;

    if (paises.length === 0) {
        lista.innerHTML = '<li class="sin-paises">No se encontraron países.</li>';
        return;
    }

    
    const aMostrar = paises.slice(0, 50);

    lista.innerHTML = aMostrar.map(pais => `
        <li class="item-pais" onclick="seleccionarPais('${pais.name.common}', '${pais.flag || '🌐'}')">
            <span class="bandera-pais">${pais.flag || '🌐'}</span>
            <span>${pais.name.common}</span>
        </li>`).join('');
}


function filtrarPaises(texto) {
    const lista = document.getElementById('lista-paises');
    if (!lista) return;

    
    lista.style.display = 'block';

    if (!texto) {
        mostrarPaises(todosPaises);
        return;
    }

    const textoMinusculas = texto.toLowerCase();

    
    const resultado = todosPaises.filter(pais =>
        pais.name.common.toLowerCase().includes(textoMinusculas)
    );

    mostrarPaises(resultado);
}


function seleccionarPais(nombre, bandera) {
    const inputBusqueda = document.getElementById('buscar-pais');
    const inputOculto = document.getElementById('pais-seleccionado');
    const inputBandera = document.getElementById('bandera-seleccionada');
    const lista = document.getElementById('lista-paises');

    
    if (inputBusqueda) inputBusqueda.value = `${bandera} ${nombre}`;

    
    if (inputOculto) inputOculto.value = nombre;
    if (inputBandera) inputBandera.value = bandera;

    
    if (lista) lista.style.display = 'none';
}


function procesarRegistro(evento) {
    evento.preventDefault();

    
    const nombres = document.getElementById('reg-nombres').value.trim();
    const apellidos = document.getElementById('reg-apellidos').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmar = document.getElementById('reg-confirmar').value;
    const telefono = document.getElementById('reg-telefono').value.trim();
    const fechaNac = document.getElementById('reg-fecha').value;
    const consola = document.querySelector('input[name="consola"]:checked')?.value;
    const nacionalidad = document.getElementById('pais-seleccionado').value;
    const bandera = document.getElementById('bandera-seleccionada').value;
    const terminos = document.getElementById('reg-terminos').checked;

    

    if (!nombres || nombres.length < 2) {
        Swal.fire('Nombres inválidos', 'Ingresa tu nombre completo (mínimo 2 caracteres).', 'warning');
        return;
    }

    if (!apellidos || apellidos.length < 2) {
        Swal.fire('Apellidos inválidos', 'Ingresa tus apellidos (mínimo 2 caracteres).', 'warning');
        return;
    }

    
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(email)) {
        Swal.fire('Correo inválido', 'Ingresa un correo electrónico válido (ej: usuario@gmail.com).', 'warning');
        return;
    }

    
    const usuarios = leer('usuarios') || [];
    const emailExiste = usuarios.some(u => u.email === email);
    if (emailExiste) {
        Swal.fire('Correo ya registrado', 'Este correo ya tiene una cuenta en Matador House.', 'error');
        return;
    }

    if (password.length < 6) {
        Swal.fire('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.', 'warning');
        return;
    }

    if (password !== confirmar) {
        Swal.fire('Contraseñas no coinciden', 'La contraseña y su confirmación deben ser iguales.', 'warning');
        return;
    }

    if (!telefono || telefono.length < 7) {
        Swal.fire('Teléfono inválido', 'Ingresa un número de teléfono válido.', 'warning');
        return;
    }

    if (!fechaNac) {
        Swal.fire('Fecha requerida', 'Ingresa tu fecha de nacimiento.', 'warning');
        return;
    }

    if (!nacionalidad) {
        Swal.fire('Nacionalidad requerida', 'Selecciona tu país de la lista.', 'warning');
        return;
    }

    if (!terminos) {
        Swal.fire('Términos requeridos', 'Debes aceptar los términos y condiciones.', 'warning');
        return;
    }

    
    const maxId = usuarios.reduce((max, u) => u.id > max ? u.id : max, 0);

    const nuevoUsuario = {
        id: maxId + 1,
        nombres,
        apellidos,
        email,
        password, 
        consola: consola || 'PS5',
        telefono,
        fechaNacimiento: fechaNac,
        nacionalidad,
        bandera,
        fechaRegistro: new Date().toISOString().split('T')[0],
        contacto: {
            ciudad: '',
            provincia: ''
        }
    };

    
    usuarios.push(nuevoUsuario);
    guardar('usuarios', usuarios);

    
    Swal.fire({
        title: '¡Registro exitoso!',
        html: `Bienvenido a Matador House, <strong>${nombres}</strong>.<br>
               Nacionalidad: ${bandera} ${nacionalidad}`,
        icon: 'success',
        confirmButtonColor: '#00439c',
        confirmButtonText: 'Iniciar sesión'
    }).then(() => {
        window.location.href = 'login.html';
    });
}
