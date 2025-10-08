// payment.js
document.addEventListener("DOMContentLoaded", async function () {
    startCountdown(30 * 60, document.getElementById("saleCountdown"));
    startCountdown(30 * 60, document.getElementById("priceValidTimer"));

    document.querySelectorAll('.crypto-option').forEach(option => {
        option.addEventListener('click', function () {
            selectCrypto(this);
        });
    });

    // Auto-select Bitcoin as default
    await updateCryptoSelection("btc");
    document.querySelector('.crypto-option[data-currency="btc"]').classList.add('selected');
});

function startCountdown(duration, display) {
    let timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            display.textContent = "00:00";
        }
    }, 1000);
}

async function updateCryptoSelection(currency) {
    const cryptoIDs = {
        btc: "bitcoin",
        eth: "ethereum",
        sol: "solana",
        xmr: "monero",
        usdc: "usd-coin",
        usdt: "tether",
        bnb: "binancecoin",
        xrp: "xrp"
    };

    if (!cryptoIDs[currency]) {
        console.error("Invalid currency selection");
        return;
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIDs[currency]}&vs_currencies=usd`);
        const data = await response.json();

        if (!data[cryptoIDs[currency]]) {
            throw new Error("Price data not available");
        }

        const price = data[cryptoIDs[currency]].usd;
        let priceUSD = 19.99; // Match site price
        let amount = (priceUSD / price).toFixed(6);

        document.getElementById("cryptoAmount").textContent = amount;
        document.getElementById("cryptoSymbol").textContent = currency.toUpperCase();
        document.getElementById("rateInfo").textContent = `@ $${price.toFixed(2)} per coin`;

        const addresses = {
            btc: "bc1q3tusz32vdm60y6cn8gwpdpkm2uc6ezmz66jv9l", // Dummy
            eth: "0x34756F0f2a9487E2bc7bC2A83B85B01cD727D28b", // Dummy
            sol: "9788xXBmpS4v1beemDnTgd6WkWgcnyLNTPpy4zosh83a", // Dummy
            xmr: "88jjBogBnNtWpZ3iURXNeoaUBwDuF6HbZC85Uigo8gbBZtD17mqjymSRXmj7vpBeC1WKCdMe5yUaJjm2txNmzhrs3i3CgnF", // Dummy
            usdc: "0x34756F0f2a9487E2bc7bC2A83B85B01cD727D28b", // Dummy (ERC20)
            usdt: "0x34756F0f2a9487E2bc7bC2A83B85B01cD727D28b", // Dummy (ERC20)
            bnb: "bnb1uqqny3we0x2rggcpc8dcg4lnsc4rkuu0k2av0x0u9k3wrt0af5gqshkdjf", // Dummy
            xrp: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" // Dummy
        };

        document.getElementById("paymentAddress").textContent = formatWalletAddress(addresses[currency] || "Select a cryptocurrency first");
    } catch (error) {
        console.error("Error fetching crypto price:", error);
        document.getElementById("rateInfo").textContent = "Price unavailable";
    }
}

function formatWalletAddress(address) {
    // Split into 44-character lines without spaces
    return address.match(/.{1,44}/g).join("\n");
}

async function selectCrypto(element) {
    document.querySelectorAll('.crypto-option').forEach(option => {
        option.classList.remove('selected');
    });

    element.classList.add('selected');
    await updateCryptoSelection(element.dataset.currency);
}

function copyAddress() {
    let addressElement = document.getElementById("paymentAddress");
    let address = addressElement.textContent || addressElement.innerText;

    if (address.includes("Select a cryptocurrency first")) {
        alert("Please select a cryptocurrency first.");
        return;
    }
    
    // Remove all spaces, line breaks, and hidden characters before copying
    let formattedAddress = address.replace(/\s+/g, "").trim();

    navigator.clipboard.writeText(formattedAddress).then(() => {
        alert("Address copied!");
    }).catch(err => {
        console.error("Failed to copy address:", err);
    });
}
