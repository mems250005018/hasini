// Every image and model the site uses lives here, so nothing is hard-coded in the components.
// Web-ready files are in /public (served); full-size originals are kept in /assets/originals.

export const models = {
  cake: "/models/cake.glb",
};

export const photos = {
  // Full-length cut-out used in the hero, under the crown and sash.
  portrait: { src: "/photos/hasini/portrait.png", width: 970, height: 1621 },

  // Snapshot of the friends, shown as the polaroid.
  group: { src: "/photos/group/friends.jpeg", width: 1280, height: 960 },

  // Cut-outs standing in the 3D photo graph, in the order they appear.
  frames: [
    "/photos/hasini/frame-1.webp",
    "/photos/hasini/frame-2.webp",
    "/photos/hasini/frame-3.webp",
    "/photos/hasini/frame-4.webp",
    "/photos/hasini/frame-5.webp",
  ],

  // The menu gallery.
  dishes: [
    { src: "/photos/dishes/chicken-biryani.png", name: "Chicken Biryani" },
    { src: "/photos/dishes/egg-rice.jpg", name: "Egg Rice" },
    { src: "/photos/dishes/non-veg.png", name: "Non-Veg Special" },
  ],
};
