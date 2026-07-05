PERSONAS = {
    "Young Professional": {
        "name": "Young Professional",
        "salary_range": (45000, 70000),
        "savings_rate_range": (0.15, 0.25),
        "investment_ratio_range": (0.10, 0.15),
        "credit_card_util_range": (0.25, 0.45),
        "recurring_merchants": {
            "Salary": "Google India",
            "Investment": ["Axis Bluechip Mutual Fund", "Mirae Asset Mutual Fund"],
            "Utilities": ["BESCOM Electricity", "Jio Telecom", "Airtel Fiber"],
            "Food": ["Swiggy", "Zomato", "Starbucks"],
            "Shopping": ["Amazon", "Myntra", "Flipkart"],
            "Travel": ["Uber", "Ola"],
            "Entertainment": ["Netflix", "Spotify"]
        },
        "life_goals": [
            {
                "title": "Higher Education",
                "confidence": 78,
                "prediction_date": "Sep 2027",
                "explanation": "Based on your educational goals search history and monthly savings accumulation."
            },
            {
                "title": "Car Purchase",
                "confidence": 68,
                "prediction_date": "Jun 2028",
                "explanation": "Predicted based on discretionary income growth and travel frequency."
            }
        ],
        "offers": [
            {
                "title": "IDBI BANK Cashback Card",
                "description": "Get 5% unlimited cashback on online shopping (Amazon, Flipkart) and 1% on offline purchases.",
                "eligibility": "Available for young professionals with consistent online spending habits."
            }
        ],
        "ai_recommendation_style": "budget_optimization"
    },
    "Experienced Salaried Employee": {
        "name": "Experienced Salaried Employee",
        "salary_range": (120000, 180000),
        "savings_rate_range": (0.25, 0.35),
        "investment_ratio_range": (0.20, 0.30),
        "credit_card_util_range": (0.15, 0.30),
        "recurring_merchants": {
            "Salary": "TCS Payroll",
            "Investment": ["Axis Bluechip Mutual Fund", "SBI SIP", "PPF Deposit"],
            "Utilities": ["BESCOM Electricity", "Airtel Fiber", "Indane Gas"],
            "Food": ["Swiggy", "Barbeque Nation", "Starbucks"],
            "Shopping": ["Reliance Fresh", "DMart", "Amazon"],
            "Travel": ["Uber", "Indian Oil"],
            "Entertainment": ["Netflix", "Hotstar"],
            "Insurance": ["HDFC Ergo Health"]
        },
        "life_goals": [
            {
                "title": "Home Purchase",
                "confidence": 92,
                "prediction_date": "Mar 2027",
                "explanation": "You are financially on track! We predicted this based on your steady mutual fund investments and high savings velocity."
            },
            {
                "title": "Wedding Planning",
                "confidence": 80,
                "prediction_date": "Dec 2027",
                "explanation": "Predicted based on family-oriented savings plans and rising fixed deposits."
            }
        ],
        "offers": [
            {
                "title": "Home Loan Booster",
                "description": "Avail special home loan rate of 8.4% with zero processing fee for your upcoming home purchase.",
                "eligibility": "Based on your high home goal readiness score and stable salary."
            },
            {
                "title": "Pre-Approved Personal Loan",
                "description": "Get up to ₹1,00,000 at 10.5% interest with zero processing fee.",
                "eligibility": "Premium status with consistent monthly salary credits."
            }
        ],
        "ai_recommendation_style": "investment_boosting"
    },
    "Early Investor": {
        "name": "Early Investor",
        "salary_range": (80000, 110000),
        "savings_rate_range": (0.40, 0.50),
        "investment_ratio_range": (0.35, 0.45),
        "credit_card_util_range": (0.05, 0.15),
        "recurring_merchants": {
            "Salary": "Zerodha Tech",
            "Investment": ["Axis Bluechip Mutual Fund", "SBI SIP", "Gold ETF", "PPF Deposit"],
            "Utilities": ["BESCOM Electricity", "Jio Telecom"],
            "Food": ["Swiggy", "Zomato"],
            "Shopping": ["DMart", "Amazon"],
            "Travel": ["Uber", "Indian Oil"],
            "Entertainment": ["Spotify"]
        },
        "life_goals": [
            {
                "title": "Retirement Planning",
                "confidence": 85,
                "prediction_date": "Jun 2035",
                "explanation": "Based on your aggressive savings rate and high mutual fund allocations."
            },
            {
                "title": "Home Purchase",
                "confidence": 75,
                "prediction_date": "Mar 2028",
                "explanation": "Based on compounding investment growth and portfolio size."
            }
        ],
        "offers": [
            {
                "title": "Portfolio Advisory Services",
                "description": "Get personalized wealth management advice and portfolio rebalancing from IDBI Bank experts.",
                "eligibility": "Offered to customers with high investment ratios."
            }
        ],
        "ai_recommendation_style": "portfolio_rebalancing"
    },
    "Young Family": {
        "name": "Young Family",
        "salary_range": (90000, 130000),
        "savings_rate_range": (0.15, 0.25),
        "investment_ratio_range": (0.10, 0.20),
        "credit_card_util_range": (0.20, 0.35),
        "recurring_merchants": {
            "Salary": "Infosys Salary",
            "Investment": ["SBI SIP", "PPF Deposit"],
            "Utilities": ["BESCOM Electricity", "Airtel Fiber", "Indane Gas"],
            "Food": ["Zomato", "Swiggy", "Starbucks"],
            "Shopping": ["DMart", "Reliance Fresh", "Amazon"],
            "Travel": ["Uber", "Indian Oil"],
            "Entertainment": ["Netflix", "Disney+ Hotstar"],
            "Insurance": ["LIC Term Life", "HDFC Ergo Health"]
        },
        "life_goals": [
            {
                "title": "Child Education Fund",
                "confidence": 90,
                "prediction_date": "Jun 2029",
                "explanation": "Based on child-oriented savings behavior and long-term security investments."
            },
            {
                "title": "Home Purchase",
                "confidence": 82,
                "prediction_date": "Mar 2027",
                "explanation": "Predicted based on growing family needs and savings accumulation."
            }
        ],
        "offers": [
            {
                "title": "Pre-Approved Personal Loan",
                "description": "Avail up to ₹1,00,000 at a special interest rate of 10.5% with zero processing fee.",
                "eligibility": "Consistent monthly salary credits."
            }
        ],
        "ai_recommendation_style": "emergency_buffer"
    },
    "Frequent Traveller": {
        "name": "Frequent Traveller",
        "salary_range": (100000, 150000),
        "savings_rate_range": (0.15, 0.25),
        "investment_ratio_range": (0.05, 0.15),
        "credit_card_util_range": (0.30, 0.50),
        "recurring_merchants": {
            "Salary": "IndiGo Payroll",
            "Investment": ["Axis Bluechip Mutual Fund"],
            "Utilities": ["BESCOM Electricity", "Jio Telecom"],
            "Food": ["Swiggy", "Starbucks"],
            "Shopping": ["Amazon", "Myntra"],
            "Travel": ["MakeMyTrip", "Uber", "Indian Oil", "Airbnb"],
            "Entertainment": ["Netflix", "Spotify"]
        },
        "life_goals": [
            {
                "title": "International Vacation",
                "confidence": 88,
                "prediction_date": "Dec 2026",
                "explanation": "Predicted based on frequent bookings with MakeMyTrip and high travel spending."
            },
            {
                "title": "Car Purchase",
                "confidence": 70,
                "prediction_date": "Jun 2027",
                "explanation": "Based on your preference for personal mobility and fuel consumption patterns."
            }
        ],
        "offers": [
            {
                "title": "IDBI BANK Travel Signature Card",
                "description": "Earn 5x reward points on flight and hotel bookings. Unlimited airport lounge access included.",
                "eligibility": "Offered to customers with high travel-related card spend."
            }
        ],
        "ai_recommendation_style": "travel_budgeting"
    },
    "High Savings Professional": {
        "name": "High Savings Professional",
        "salary_range": (200000, 300000),
        "savings_rate_range": (0.45, 0.55),
        "investment_ratio_range": (0.30, 0.40),
        "credit_card_util_range": (0.10, 0.25),
        "recurring_merchants": {
            "Salary": "Microsoft Payroll",
            "Investment": ["Axis Bluechip Mutual Fund", "SBI SIP", "PPF Deposit", "Gold ETF"],
            "Utilities": ["BESCOM Electricity", "Airtel Fiber", "Indane Gas"],
            "Food": ["Zomato", "Starbucks"],
            "Shopping": ["Amazon", "Myntra", "DMart"],
            "Travel": ["Uber", "Indian Oil"],
            "Entertainment": ["Netflix", "Spotify", "YouTube Premium"],
            "Insurance": ["LIC Term Life", "HDFC Ergo Health"]
        },
        "life_goals": [
            {
                "title": "Retirement Planning",
                "confidence": 95,
                "prediction_date": "Dec 2032",
                "explanation": "On track for early retirement! Predicted based on your high net worth velocity."
            },
            {
                "title": "Villa Purchase",
                "confidence": 90,
                "prediction_date": "Mar 2028",
                "explanation": "Based on high savings balances and regular premium SIP credits."
            }
        ],
        "offers": [
            {
                "title": "Wealth Management Account",
                "description": "Access dedicated wealth managers and premium investment products with zero maintenance fees.",
                "eligibility": "Available for HNIs with total relationship value > ₹15 Lakhs."
            },
            {
                "title": "IDBI BANK Royal Credit Card",
                "description": "Unlimited cashback and luxury hotel membership benefits.",
                "eligibility": "Premium status with salary > ₹2 Lakh/mo."
            }
        ],
        "ai_recommendation_style": "wealth_preservation"
    }
}
