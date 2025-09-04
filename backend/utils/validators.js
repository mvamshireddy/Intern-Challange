function validateName(name) {
  return typeof name === "string" && name.length >= 20 && name.length <= 60;
}
function validateAddress(address) {
  return typeof address === "string" && address.length <= 400;
}
function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(password);
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
module.exports = { validateName, validateAddress, validatePassword, validateEmail };