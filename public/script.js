(function () {
  let $input_bill = document.querySelector(".input_bill");
  let $tip_amount_value = document.querySelector(".tip_amount_value");
  let $btn_tip = document.querySelectorAll(".btn_tip");
  let $input_people = document.querySelector(".input_people");
  let $tip_total = document.querySelector(".tip_total");
  let $btn_reset = document.querySelector(".btn_reset");
  let $input_custom = document.querySelector(".input_custom");

  const tip = {
    tip_amount: 0,
    default_bill: 0,
    total: 0,
    total_people: 0,
    tip_ratio: 0,
  };

  function resetTip() {
    $btn_tip.forEach((tip) => tip.classList.remove("active"));
  }

  function setTip(tip_el = null) {
    resetTip();
    if ($input_custom && $input_custom.value)
      resetInputs({ custom_only: true });
    if (!tip_el) return;
    tip_el.classList.add("active");
    updateTip(tip_el.dataset.tip);
  }

  function updateTip(tip_value = 0) {
    tip.tip_ratio = parseInt(tip_value);
    if (tip.total > 0 && tip.total_people > 0) {
      let tip_percentage = tip.tip_ratio / 100;
      tip.tip_amount = (tip.default_bill * tip_percentage) / tip.total_people;
      $tip_amount_value.innerHTML = tip.tip_amount.toFixed(2);
    }
  }

  function resetInputs(options = {}) {
    let $inputs = document.querySelectorAll("input[type='number']");
    if (options && "custom_only" in options && !!options.custom_only) {
      let $input = [...$inputs].find(($input) =>
        $input.classList.contains("input_custom")
      );

      $input && _removeValidation($input);
      return;
    }
    $inputs.forEach(($input) => _removeValidation($input));

    // Private Function
    function _removeValidation($input) {
      $input.value = "";
      $input.classList.contains("valid") && $input.classList.remove("valid");
      $input.classList.contains("invalid") &&
        $input.classList.remove("invalid");
    }
  }

  function resetValues(deep = false) {
    var fields = ["tip_amount", "total"];
    fields.forEach((field) => (tip[field] = 0));
    $tip_amount_value.innerHTML = tip.tip_amount.toFixed(2);
    $tip_total.innerHTML = tip.total.toFixed(2);

    if (deep) {
      tip.default_bill = 0;
      tip.total_people = 0;
      $input_people.value = 0;
      $input_bill.value = 0;
      resetInputs();
    }
  }

  function validateInput($input) {
    if ($input) {
      if (!$input.value.length || isNaN($input.value)) return false;
      let $info_group = $input.closest(".info_group");
      let $error_text = $info_group.querySelector(".error");

      if (!parseInt($input.value)) {
        if ($error_text) $error_text.style.display = "block";
        $input.classList.remove("valid");
        $input.classList.add("invalid");
        return false;
      }
      if ($error_text) $error_text.style.display = "none";
      $input.classList.remove("invalid");
      $input.classList.add("valid");
      return true;
    }
  }

  function updateTotal(bill = 0, people = 0) {
    tip.default_bill = bill;
    tip.total_people = people;

    if (tip.default_bill > 0 && tip.total_people > 0) {
      tip.total = tip.default_bill / tip.total_people;
      if (!!(tip.tip_amount > 0)) tip.total += tip.tip_amount;
      $tip_total.innerHTML = tip.total.toFixed(2);
      return;
    }
    resetValues();
    $tip_total.innerHTML = tip.total.toFixed(2);
  }
  function init() {
    $input_bill.addEventListener("change", function (e) {
      if (validateInput(this)) {
        updateTotal(this.value, tip.total_people);
        updateTip(tip.tip_ratio);
      }
    });

    $input_people.addEventListener("change", function (e) {
      if (validateInput(this)) {
        updateTotal(tip.default_bill, this.value);
        updateTip(tip.tip_ratio);
      }
    });

    $btn_tip.forEach((tip) => {
      tip.addEventListener("click", function (e) {
        setTip(this);
      });
    });
    $btn_reset.addEventListener("click", resetValues.bind(null, true));

    $input_custom.addEventListener("click", resetTip);

    $input_custom.addEventListener("change", function (e) {
      if (validateInput(this)) {
        updateTotal(tip.default_bill, tip.total_people);
        updateTip(this.value);
      }
    });
  }

  init();
})();
