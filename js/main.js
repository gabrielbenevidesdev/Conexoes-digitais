(function () {
  var c = window.SITE_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var ok = function (v) { return v && !/^COLOQUE_AQUI/.test(v); };
  var set = function (s, t) { var e = $(s); if (e && t) e.textContent = t; };

  // Perfil
  set("[data-nome]", c.nome);
  set("[data-descricao]", c.descricao);
  set("[data-iniciais]", c.iniciais);
  var tags = $("[data-etiquetas]");
  if (tags && c.etiquetas) {
    var icons = tags.querySelectorAll("li");
    c.etiquetas.forEach(function (t, i) { if (icons[i]) icons[i].querySelector("span").textContent = t; });
  }
  var foto = $("[data-foto]");

if (foto && c.foto) {
  foto.addEventListener("load", function () {
    foto.hidden = false;
  });

  foto.addEventListener("error", function () {
    console.error("Erro ao carregar a foto:", foto.src);
    foto.hidden = true;
  });

  foto.src = c.foto;
}x

  // Contatos
  var links = {
    whatsapp: ok(c.whatsapp) ? "https://wa.me/" + String(c.whatsapp).replace(/\D/g, "") : null,
    instagram: ok(c.instagram) ? c.instagram : null,
    github: ok(c.github) ? c.github : null,
    email: ok(c.email) ? "mailto:" + c.email : null
  };
  document.querySelectorAll("[data-contato]").forEach(function (a) {
    var k = a.getAttribute("data-contato"), url = links[k];
    if (url) { a.href = url; return; }
    a.href = "#";
    a.addEventListener("click", function (e) {
      e.preventDefault();
      console.warn("Link de " + k + " ainda não configurado em js/config.js");
    });
  });

  // Projetos
  var lista = $("[data-lista-projetos]"), vazio = $("[data-vazio]"), ps = window.SITE_PROJETOS || [];
  if (lista) {
    if (!ps.length) { vazio.hidden = false; return; }
    var el = function (t, cls, txt) { var e = document.createElement(t); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
    ps.forEach(function (p) {
      var card = el("article", "card projeto");
      if (p.imagem) { var im = el("img"); im.src = p.imagem; im.alt = p.nome ? "Imagem do projeto " + p.nome : ""; im.loading = "lazy"; card.appendChild(im); }
      if (p.nome) card.appendChild(el("h2", "", p.nome));
      if (p.descricao) card.appendChild(el("p", "mut", p.descricao));
      if (p.tecnologias && p.tecnologias.length) {
        var ul = el("ul", "tags");
        p.tecnologias.forEach(function (t) { ul.appendChild(el("li", "", t)); });
        card.appendChild(ul);
      }
      var acoes = el("div", "acoes");
      [["demo", "Ver demonstração"], ["repositorio", "Ver código"]].forEach(function (x) {
        if (p[x[0]]) { var a = el("a", "mini", x[1]); a.href = p[x[0]]; a.target = "_blank"; a.rel = "noopener noreferrer"; acoes.appendChild(a); }
      });
      if (acoes.children.length) card.appendChild(acoes);
      lista.appendChild(card);
    });
  }
})();
