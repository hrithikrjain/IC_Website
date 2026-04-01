function BrandLogo({ className = "h-11 w-11", imageClassName = "", alt = "Intellectual Capital logo" }) {
  return (
    <div className={`${className} overflow-hidden rounded-full shadow-glow ${imageClassName}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <ellipse cx="60" cy="60" rx="54" ry="56" fill="#f97316" stroke="#1f1b2e" strokeWidth="3.5" />
        <circle cx="60" cy="31" r="7" fill="#2b201b" />
        <path
          d="M41 45C49 49 57 54 60 57C63 54 71 49 79 45C76 52 70 58 66 67C63 74 62 84 63 97C58 91 54 84 52 77C50 84 44 91 37 97C43 83 45 73 44 65C43 57 38 51 41 45Z"
          fill="#2b201b"
        />
      </svg>
      <span className="sr-only">{alt}</span>
    </div>
  );
}

export default BrandLogo;
