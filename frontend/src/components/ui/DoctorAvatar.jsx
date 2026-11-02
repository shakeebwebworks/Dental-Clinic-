const initials = (name) =>
  name.replace("Dr. ", "").split(" ").map((part) => part[0]).join("");

export default function DoctorAvatar({ doctor, large = false }) {
  const size = large ? "doctor-avatar-lg flex-shrink-0 mx-auto mx-sm-0" : "";
  if (doctor.photo) {
    return <img src={doctor.photo} alt={doctor.name} className={`doctor-avatar doctor-photo ${size}`} />;
  }
  return (
    <div className={`doctor-avatar ${size}`} aria-hidden="true">
      {initials(doctor.name)}
    </div>
  );
}
