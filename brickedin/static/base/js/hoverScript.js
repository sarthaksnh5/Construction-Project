function initModal(params) {
  const title = document.getElementById("modalTitle");
  const para = document.getElementById("modalPara");
  if (params == 1) {
    title.innerHTML = "Raise a Request";
    var test = "<ul><li>";
    test +=
      "Raise a house construction service request or call us at +91 9150689904. Our team will get in touch with you to understand your requirements in more detail.";
    test += "</li><li>";
    test += "They will arrange the meeting with our technical expert.";
    test += "</li></ul>";
    para.innerHTML = test;
  } else if (params == 2) {
    title.innerHTML = "Meet our Expert";
    var test = "<ul><li>";
    test +=
      "Experts will guide you in selecting the right package for house construction and solve any queries that you may have.";
    test += "</li></ul>";
    para.innerHTML = test;
  } else if (params == 3) {
    title.innerHTML = "Book with Us";
    var test = "<ul><li>";
    test +=
      "Good to go ! You pay 5% of the estimated project cost as the booking amount.";
    test += "</li></ul>";
    para.innerHTML = test;
  } else if (params == 4) {
    title.innerHTML = "Receive Detailed Plans";
    var test = "<ul><li>";
    test +=
      "Our architects will provide exhaustive drawings and designs till you are completely satisfied.";
    test += "</li><li>";
    test +=
      "House construction Designs include floor plans, 3D elevations, electrical, plumbing and structural designs";
    test += "</li><li>";
    test +=
      "Project manager is allotted and project management team works on your contract.";
    test += "</li><li>";
    test +=
      "All project details like specifications, work and payment schedules etc are fed into the system.";
    test += "</li></ul>";
    para.innerHTML = test;
  } else if (params == 5) {
    title.innerHTML = "Track & Transact";
    var test = "<ul><li>";
    test +=
      "To ensure absolute trust, BrickedIN provides an escrow model where you transfer the amount for every stage of the project.";
    test += "</li><li>";
    test +=
      "Only on successful completion of a stage,amount is transferred to the contractor.";
    test += "</li><li>";
    test +=
      "Our project management team tracks and monitors your project through our system and processes - through regular site visits.";
    test += "</li><li>";
    test += "You get the project updates through our customer application.";
    test += "</li></ul>";
    para.innerHTML = test;
  } else {
    title.innerHTML = "Raise a Request";
    var test = "<ul><li>";
    test +=
      "The last and final stage. We make sure you are well settled in your newly constructed home. Our journey together doesn't end here. We provide <b>5 years of warranty.</b>";
    test += "</li></ul>";
    para.innerHTML = test;
  }
  $("#modal").modal("show");
}
