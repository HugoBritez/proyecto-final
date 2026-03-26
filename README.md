# Tecno Store

Proyecto web estático para practicar flujo de tienda online (listado de productos y carrito).

## Estructura del proyecto

- [index.html](index.html): página principal.
- [script.js](script.js): lógica JavaScript general. (Posiblemente responsabilidad de @Sebas)
- [styles.css](styles.css): estilos globales. (se pueden agregar mas cosas abajo, pero no tocar lo que ya existe, ish)
- [pages/productos.html](pages/productos.html): vista de productos.
- [pages/carrito.html](pages/carrito.html): vista del carrito.
- `assets/`: recursos estáticos (imágenes, íconos, etc.).

## Objetivo

Construir una tienda simple con:

- listado de productos,
- agregado/eliminación de ítems en carrito,
- navegación clara entre vistas.

## Cómo ejecutar

Al ser un proyecto estático, podés abrir [index.html](index.html) directamente en el navegador.

Opcional (recomendado): usar una extensión como **Live Server** en VS Code para recarga automática.

## Guía rápida: cómo usar los estilos CSS

Este proyecto usa **clases reutilizables** (utilities) para evitar repetir CSS.

### 1) Reglas del equipo

- Reutilizar clases existentes antes de crear nuevas.
- Combinar clases pequeñas (`flex`, `gap-2`, `p-2`, etc.).
- Si una clase nueva sirve en más de una parte, agregarla a `styles.css`.
- Nombrar clases de forma simple y consistente.

### 2) Clases más usadas

#### Layout

- `container`: centra contenido y limita ancho.
- `flex`: activa `display: flex`.
- `flex-col`: flex en columna.
- `items-center`: alinea vertical.
- `justify-between`: separa extremos.
- `gap-1`, `gap-2`, `gap-3`: espacio entre elementos.

#### Espaciado

- `p-1`, `p-2`, `p-3`: padding.
- `mt-1`, `mt-2`, `mt-3`: margen superior.

#### Texto

- `text-center`: centrado.
- `text-lg`: tamaño grande.
- `text-bold`: negrita.

#### Componentes

- `card`: tarjeta con fondo, sombra y borde redondeado.
- `btn`: botón base.
- `bg-page`: fondo y color general de la página.

### 3) Ejemplo de uso

```html
<header class="container flex justify-between items-center p-2">
  <h1 class="text-lg text-bold">Tienda Facu</h1>
  <a class="btn" href="#">Ver carrito</a>
</header>

<section class="container mt-3 flex gap-2">
  <article class="card p-2">
    <h2 class="text-bold">Producto 1</h2>
    <p class="mt-1">$10.000</p>
  </article>
</section>
```

### 4) Cuándo crear una clase nueva

Crear clase nueva **solo si**:

- el estilo se repite 3+ veces, o
- representa un componente claro (por ejemplo `product-card`, `navbar`).

Si no, usar utilities existentes.

<!-- ...existing code... -->
