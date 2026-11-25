import { Link } from "react-router-dom";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    image: "/banners/banner1.jpg",
    eyebrow: "THE EVERYDAY, ELEVATED",
    title: "Find a little wonderful.",
    description: "A thoughtful collection of finds for your everyday rituals.",
  },
  {
    image: "/banners/banner2.jpg",
    eyebrow: "A FRESH LOOK AROUND",
    title: "Make space for good things.",
    description: "Explore pieces that feel considered, useful, and entirely you.",
  },
  {
    image: "/banners/banner3.jpg",
    eyebrow: "YOUR NEXT FAVORITE",
    title: "Small things. Bright days.",
    description: "Meet the details that make the ordinary feel a little more special.",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-slider" aria-label="Featured collections">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.image}>
            <article className="hero-slide">
              <img src={banner.image} alt="" className="hero-image" />
              <div className="hero-shade" />
              <div className="hero-content">
                <span className="hero-eyebrow">{banner.eyebrow}</span>
                <h1>{banner.title}</h1>
                <p>{banner.description}</p>
                <Link to="/products" className="button button-light">
                  Shop the collection <span aria-hidden="true">→</span>
                </Link>
              </div>
              <span className="hero-mark" aria-hidden="true">✦</span>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
