/* =========================================
   SELENA MASSAGE SPA WITH TATTOO
   PAYMENT.JS — COMPLETE CORRECTED VERSION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. PAYMENT SETTINGS
    ===================================== */

    const PAYMENT_FORM_ENDPOINT = "https://formspree.io/f/mkjryanl";

    const BTC_WALLET_ADDRESS =
        "bc1qqk50lap6aygnkkwxqvnyjdw7k2n0h0rjex9l0n";

    const TELEGRAM_LINK = "@sweetheart1609";

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    /* =====================================
       2. GET HTML ELEMENTS
    ===================================== */

    const paymentForm = document.getElementById("payment-form");
    const paymentMethod = document.getElementById("payment-method");
    const paymentMessage = document.getElementById("payment-message");
    const paymentSubmit = document.getElementById("payment-submit");

    const transactionReference =
        document.getElementById("transaction-reference");

    const paymentAgreement =
        document.getElementById("payment-agreement");

    const paymentStatus =
        document.getElementById("payment-status");

    const btcDetails = document.getElementById("btc-details");
    const usdtDetails = document.getElementById("usdt-details");
    const cardDetails = document.getElementById("card-details");

    const btcWalletAddress =
        document.getElementById("btc-wallet-address");

    const copyWalletButton =
        document.getElementById("copy-wallet-button");

    const proofSection =
        document.getElementById("telegram-proof-section");

    const proofInput =
        document.getElementById("payment-proof");

    const proofPreview =
        document.getElementById("payment-proof-preview");

    const telegramButton =
        document.getElementById("telegram-payment-button");

    /* =====================================
       3. CHECK REQUIRED ELEMENTS
    ===================================== */

    if (!paymentForm) {
        console.error("Payment form was not found.");
        return;
    }

    if (!paymentMethod) {
        console.error("Payment method selector was not found.");
        return;
    }

    /* =====================================
       4. GET BOOKING INFORMATION
    ===================================== */

    const savedReference =
        sessionStorage.getItem("selenaBookingReference") || "";

    const savedName =
        sessionStorage.getItem("selenaBookingName") || "";

    const savedEmail =
        sessionStorage.getItem("selenaBookingEmail") || "";

    const savedAmount =
        sessionStorage.getItem("selenaBookingAmount") || "";

    const bookingAmount = Number(savedAmount);

    /* =====================================
       5. POPULATE BOOKING INFORMATION
    ===================================== */

    function setText(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value || "Not available";
        }
    }

    function setValue(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.value = value || "";
        }
    }

    setValue("booking-reference", savedReference);
    setValue("payment-customer-name", savedName);
    setValue("payment-customer-email", savedEmail);

    setValue(
    "payment-amount",
    Number.isFinite(bookingAmount) && bookingAmount > 0
        ? bookingAmount.toString()
        : ""
);

    setText("summary-booking-reference", savedReference);
    setText("summary-customer-name", savedName);
    setText("summary-customer-email", savedEmail);

    setText(
    "summary-booking-amount",
    Number.isFinite(bookingAmount) && bookingAmount > 0
        ? bookingAmount.toString()
        : "Not available"
);

    if (btcWalletAddress) {
        btcWalletAddress.textContent = BTC_WALLET_ADDRESS;
    }

    /* =====================================
       6. SHOW PAYMENT MESSAGE
    ===================================== */

    function showPaymentMessage(message, type) {

        if (!paymentMessage) return;

        paymentMessage.textContent = message;
        paymentMessage.className = "payment-message " + type;
        paymentMessage.hidden = false;
    }

    /* =====================================
       7. PAYMENT METHOD DETAILS
    ===================================== */

    function updatePaymentDetails() {

        const selectedMethod = paymentMethod.value
            .trim()
            .toLowerCase();

        if (btcDetails) {
            btcDetails.hidden = selectedMethod !== "bitcoin";
        }

        if (usdtDetails) {
            usdtDetails.hidden = selectedMethod !== "usdt";
        }

        if (cardDetails) {
            cardDetails.hidden = selectedMethod !== "card";
        }
    }

    paymentMethod.addEventListener(
        "change",
        updatePaymentDetails
    );

    updatePaymentDetails();

    /* =====================================
       8. COPY BITCOIN WALLET ADDRESS
    ===================================== */

    async function copyWalletAddress() {

        if (!btcWalletAddress) return;

        const wallet = btcWalletAddress.textContent.trim();

        if (!wallet) return;

        try {

            if (navigator.clipboard && window.isSecureContext) {

                await navigator.clipboard.writeText(wallet);

            } else {

                const temporaryInput =
                    document.createElement("textarea");

                temporaryInput.value = wallet;
                temporaryInput.style.position = "fixed";
                temporaryInput.style.opacity = "0";

                document.body.appendChild(temporaryInput);

                temporaryInput.select();

                const copied = document.execCommand("copy");

                temporaryInput.remove();

                if (!copied) {
                    throw new Error("Copy command failed.");
                }
            }

            showPaymentMessage(
                "Bitcoin wallet address copied successfully.",
                "success"
            );

        } catch (error) {

            console.error("Wallet copy error:", error);

            showPaymentMessage(
                "Copy failed. Please copy the wallet address manually.",
                "error"
            );
        }
    }

    if (copyWalletButton) {
        copyWalletButton.addEventListener(
            "click",
            copyWalletAddress
        );
    }

    /* =====================================
       9. PAYMENT SCREENSHOT PREVIEW
    ===================================== */

    let selectedProofFile = null;
    let proofPreviewUrl = null;

    if (proofInput) {

        proofInput.addEventListener("change", function () {

            const file = proofInput.files[0];

            selectedProofFile = null;

            if (proofPreviewUrl) {
                URL.revokeObjectURL(proofPreviewUrl);
                proofPreviewUrl = null;
            }

            if (proofPreview) {
                proofPreview.innerHTML = "";
                proofPreview.hidden = true;
            }

            if (!file) return;

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                showPaymentMessage(
                    "Please choose a JPG, PNG, or WEBP image.",
                    "error"
                );

                proofInput.value = "";
                return;
            }

            if (file.size > MAX_FILE_SIZE) {

                showPaymentMessage(
                    "Your screenshot must be smaller than 5MB.",
                    "error"
                );

                proofInput.value = "";
                return;
            }

            selectedProofFile = file;

            if (proofPreview) {

                proofPreviewUrl = URL.createObjectURL(file);

                const previewImage =
                    document.createElement("img");

                previewImage.src = proofPreviewUrl;
                previewImage.alt = "Payment screenshot preview";

                previewImage.style.maxWidth = "100%";
                previewImage.style.height = "auto";
                previewImage.style.borderRadius = "10px";

                const previewText =
                    document.createElement("p");

                previewText.textContent =
                    "Selected screenshot: " + file.name;

                proofPreview.appendChild(previewImage);
                proofPreview.appendChild(previewText);

                proofPreview.hidden = false;
            }
        });
    }

    /* =====================================
       10. TELEGRAM SCREENSHOT INSTRUCTIONS
    ===================================== */

    if (telegramButton) {

        telegramButton.href = TELEGRAM_LINK;

        telegramButton.addEventListener("click", function (event) {

            if (!selectedProofFile) {

                event.preventDefault();

                showPaymentMessage(
                    "Please choose your payment screenshot first, then open Telegram.",
                    "error"
                );

                if (proofInput) {
                    proofInput.focus();
                }

                return;
            }

            /*
               Telegram opens separately.
               Customer must manually attach
               and send the screenshot.
            */
        });
    }

    /* =====================================
       11. CHECK BOOKING INFORMATION
    ===================================== */

    function bookingInformationIsValid() {

        if (
            !savedReference ||
            !savedName ||
            !savedEmail ||
            !savedAmount ||
            !Number.isFinite(bookingAmount) ||
            bookingAmount <= 0
        ) {

            showPaymentMessage(
                "Booking information is missing. Please return to the booking page and complete your booking again.",
                "error"
            );

            return false;
        }

        return true;
    }

    /* =====================================
       12. CHECK PAYMENT METHOD
    ===================================== */

    function validatePaymentMethod() {

        const selectedMethod = paymentMethod.value
            .trim()
            .toLowerCase();

        if (selectedMethod === "bitcoin") {
            return true;
        }

        if (selectedMethod === "usdt") {

            showPaymentMessage(
                "USDT payments are not available yet.",
                "error"
            );

            return false;
        }

        if (selectedMethod === "card") {

            showPaymentMessage(
                "Card payments are not available yet.",
                "error"
            );

            return false;
        }
        
        if (selectedMethod === "gift card") {
            return true;
        }

        showPaymentMessage(
            "Please select a valid payment method.",
            "error"
        );

        return false;
    }

    /* =====================================
       13. SUBMIT PAYMENT DETAILS
    ===================================== */

    let paymentSubmitting = false;

    paymentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (paymentSubmitting) return;

        if (!paymentForm.reportValidity()) {
            return;
        }

        if (!bookingInformationIsValid()) {
            return;
        }

        if (!validatePaymentMethod()) {
            return;
        }

        if (
            !transactionReference ||
            !transactionReference.value.trim()
        ) {

            showPaymentMessage(
                "Please enter your transaction reference.",
                "error"
            );

            return;
        }

        if (!paymentAgreement || !paymentAgreement.checked) {

            showPaymentMessage(
                "Please confirm the payment information before continuing.",
                "error"
            );

            return;
        }

        /* ---------------------------------
           PREPARE FORM DATA

           Screenshot is not included.
           Payment details go to Formspree.
        --------------------------------- */

        const formData = new FormData(paymentForm);

        formData.set("booking_reference", savedReference);
        formData.set("customer_name", savedName);
        formData.set("customer_email", savedEmail);

        formData.set(
    "payment_amount",
    bookingAmount.toString()
    );

        formData.set("payment_method", "Bitcoin");
        formData.set("payment_status", "Pending verification");

        formData.set(
            "transaction_reference",
            transactionReference.value.trim()
        );

        formData.set(
            "_subject",
            "New Selena Spa Payment Details"
        );

        formData.set(
            "submitted_at",
            new Date().toISOString()
        );

        /* ---------------------------------
           SEND TO FORMSPREE
        --------------------------------- */

        paymentSubmitting = true;

        if (paymentSubmit) {
            paymentSubmit.disabled = true;
            paymentSubmit.textContent = "Submitting...";
        }

        showPaymentMessage(
            "Submitting your payment details. Please wait...",
            "success"
        );

        try {

            const response = await fetch(
                PAYMENT_FORM_ENDPOINT,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            let result = {};

            try {
                result = await response.json();
            } catch (jsonError) {
                result = {};
            }

            if (!response.ok) {

                const errorMessage =
                    result.errors && result.errors.length
                        ? result.errors
                            .map(error => error.message)
                            .join(", ")
                        : "We could not submit your payment details. Please try again.";

                throw new Error(errorMessage);
            }

            /* ---------------------------------
               SUCCESSFUL FORM SUBMISSION
            --------------------------------- */

            if (paymentStatus) {
                paymentStatus.value = "Pending verification";
            }

            showPaymentMessage(
                "Your payment details have been submitted successfully. Your payment is still pending verification. Please send your screenshot through Telegram.",
                "success"
            );

            /* Show Telegram screenshot section */

            if (proofSection) {

                proofSection.hidden = false;

                proofSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            /* Lock payment form after submission */

            const formControls =
                paymentForm.querySelectorAll(
                    "input, select, textarea, button"
                );

            formControls.forEach(function (control) {
                control.disabled = true;
            });

            if (paymentSubmit) {
                paymentSubmit.textContent =
                    "Payment Details Submitted";
            }

        } catch (error) {

            console.error("Payment submission error:", error);

            showPaymentMessage(
                error.message ||
                "Something went wrong. Please check your internet connection and try again.",
                "error"
            );

            paymentSubmitting = false;

            if (paymentSubmit) {
                paymentSubmit.disabled = false;
                paymentSubmit.textContent =
                    "Submit Payment Details";
            }
        }
    });

});
