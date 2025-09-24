const Logo = () => {
  return (
    <>
      <img
        src="/logoipsum-363.svg"
        alt="Tecno Soft Logo"
        className="h-[40px] w-[70px] object-contain"
        onError={(e) => (e.target.style.display = "none")} // Hide broken image
      />
    </>
  );
};

export default Logo;
