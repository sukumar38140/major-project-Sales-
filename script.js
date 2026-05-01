// Toast
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";
  setTimeout(() => t.style.display = "none", 3000);
}

// Submit → WhatsApp
document.getElementById("projectForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const college = document.getElementById("college").value.trim();
  const roll = document.getElementById("rollNo").value.trim();
  const phone = document.getElementById("whatsapp").value.trim();
  const title = document.getElementById("projectTitle").value.trim();
  const type = document.getElementById("projectType").value;
  const domain = document.getElementById("domain").value;
  const desc = document.getElementById("projectDesc").value.trim() || "Not provided";

  if (!name || !college || !roll || !phone || !title || !type || !domain) {
    showToast("⚠️ Please fill all fields");
    return;
  }

  if (!document.getElementById("termsCheckbox").checked) {
    showToast("⚠️ Accept Terms & Conditions");
    return;
  }

  const message = `🎓 New Project Request

Name: ${name}
College: ${college}
Roll No: ${roll}

Project:
Type: ${type}
Domain: ${domain}
Title: ${title}

Description:
${desc}

Contact: ${phone}

⚠️ Your payment is still pending. Please complete the advance payment.

💡 Don't worry, your project will be completed soon...`;

  const url = "https://wa.me/919494565162?text=" + encodeURIComponent(message);

  showToast("Opening WhatsApp...");
  setTimeout(() => window.open(url, "_blank"), 500);
});

// Payment → Direct UPI (NO validation)
document.getElementById("payAdvanceBtn").addEventListener("click", function() {

  const name = document.getElementById("fullName").value || "Student";

  const upiUrl = `upi://pay?pa=8978943122@upi&pn=Kumar&am=199&cu=INR&tn=Project Advance - ${name}`;

  window.location.href = upiUrl;

  showToast("Opening UPI App...");
});