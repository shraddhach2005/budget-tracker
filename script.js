let budget = 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const budgetInput = document.getElementById("budget-input");
const setBudgetBtn = document.getElementById("set-budget");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const month = document.getElementById("month");

const list = document.getElementById("list");

let chart;

// LOGIN
function login() {
  const u = document.getElementById("loginUser").value;
  const p = document.getElementById("loginPass").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";
  } else {
    alert("Wrong login");
  }
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// SET BUDGET
setBudgetBtn.onclick = () => {
  budget = Number(budgetInput.value);
  localStorage.setItem("budget", budget);
  updateUI();
};

// ADD EXPENSE
document.getElementById("add-expense").onclick = () => {
  if (!title.value || !amount.value) return;

  expenses.push({
    id: Date.now(),
    title: title.value,
    amount: Number(amount.value),
    category: category.value,
    month: month.value
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));

  render();
  updateUI();
  updateChart();

  title.value = "";
  amount.value = "";
};

// DELETE
function del(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  render();
  updateUI();
  updateChart();
}

// TOTAL
function totalExpense() {
  return expenses.reduce((a, b) => a + b.amount, 0);
}

// UI
function updateUI() {
  document.getElementById("budget").innerText = budget;
  document.getElementById("expense").innerText = totalExpense();
  document.getElementById("balance").innerText = budget - totalExpense();
}

// RENDER
function render() {
  list.innerHTML = "";

  expenses.forEach(e => {
    const div = document.createElement("div");
    div.classList.add("item");

    div.innerHTML = `
      <div>
        ${e.title} (${e.category}, ${e.month}) - ₹${e.amount}
      </div>
      <button class="delete-btn" onclick="del(${e.id})">Delete</button>
    `;

    list.appendChild(div);
  });
}

// CHART
function updateChart() {
  const cat = ["Food", "Travel", "Bills", "Other"];
  const val = [0, 0, 0, 0];

  expenses.forEach(e => {
    val[cat.indexOf(e.category)] += e.amount;
  });

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels: cat,
      datasets: [{
        data: val,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"]
      }]
    }
  });
}

// PDF EXPORT
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");

  doc.text("Budget Report", 10, 10);

  doc.text(`Budget: Rs. ${budget}`, 10, 20);
  doc.text(`Expense: Rs. ${totalExpense()}`, 10, 30);
  doc.text(`Balance: Rs. ${budget - totalExpense()}`, 10, 40);

  let y = 55;

  expenses.forEach(e => {
    doc.text(`${e.title} = Rs. ${e.amount}`, 10, y);
    y += 10;
  });

  doc.save("budget-report.pdf");
}

// LOAD
window.onload = () => {
  budget = Number(localStorage.getItem("budget")) || 0;

  render();
  updateUI();
  updateChart();
};