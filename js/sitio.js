// GoChannel — menú móvil y modal de contacto.

(function () {
  // Menú móvil
  var boton = document.querySelector('.hamburguesa');
  var nav = document.querySelector('.nav');
  if (boton && nav) {
    boton.addEventListener('click', function () {
      var abierta = nav.classList.toggle('abierta');
      boton.setAttribute('aria-expanded', abierta ? 'true' : 'false');
    });
  }

  // Buscador de marcas (página Marcas)
  var buscarMarca = document.getElementById('buscar-marca');
  if (buscarMarca) {
    var marcas = Array.prototype.slice.call(document.querySelectorAll('.marcas-grid .marca'));
    var aviso = document.getElementById('sin-marcas');
    buscarMarca.addEventListener('input', function () {
      var q = buscarMarca.value.trim().toLowerCase();
      var visibles = 0;
      marcas.forEach(function (m) {
        var calza = (m.getAttribute('data-marca') || m.textContent).toLowerCase().indexOf(q) !== -1;
        m.style.display = calza ? '' : 'none';
        if (calza) visibles++;
      });
      if (aviso) aviso.style.display = visibles ? 'none' : 'block';
    });
  }

  // Modal de contacto: lo abre cualquier enlace o botón con href="#contacto"
  var modal = document.getElementById('modal-contacto');
  if (!modal) return;

  function abrir(e) {
    if (e) e.preventDefault();
    modal.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    if (nav) nav.classList.remove('abierta');
    var primero = modal.querySelector('input, textarea');
    if (primero) primero.focus();
  }
  function cerrar() {
    modal.classList.remove('abierto');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[href="#contacto"]').forEach(function (el) {
    el.addEventListener('click', abrir);
  });
  modal.querySelectorAll('[data-cerrar]').forEach(function (el) {
    el.addEventListener('click', cerrar);
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) cerrar();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrar();
  });

  // Formulario "Hablemos": se envía a Formspree, que lo reenvía al correo de
  // GoChannel. Se manda por fetch para que el visitante no salga de la página.
  var form = modal.querySelector('form');
  if (form) {
    var error = document.createElement('p');
    error.style.cssText = 'display:none;color:#b42318;font-size:14px;margin:10px 0 0';
    form.appendChild(error);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var enviar = form.querySelector('[type="submit"]');
      enviar.disabled = true;
      error.style.display = 'none';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          form.reset();
          form.style.display = 'none';
          var ok = modal.querySelector('.modal-ok');
          if (ok) ok.style.display = 'block';
        })
        .catch(function () {
          error.textContent = 'No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo, o escríbenos a contacto@gochannel.cl.';
          error.style.display = 'block';
        })
        .then(function () { enviar.disabled = false; });
    });
  }
})();
