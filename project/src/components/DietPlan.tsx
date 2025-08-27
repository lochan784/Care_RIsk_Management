import React from 'react';
import { UtensilsCrossed, Apple, Heart, CheckCircle } from 'lucide-react';

export default function DietPlan() {
  const dietRecommendations = [
    {
      category: "High Risk Diabetes (Tier 4-5)",
      color: "border-red-200 bg-red-50",
      recommendations: [
        "Low glycemic index foods (GI < 55)",
        "Complex carbohydrates: quinoa, brown rice, oats",
        "Lean proteins: fish, poultry, legumes",
        "High fiber vegetables: broccoli, spinach, brussels sprouts",
        "Healthy fats: avocado, nuts, olive oil",
        "Limit simple sugars and refined carbohydrates"
      ]
    },
    {
      category: "Moderate Risk (Tier 2-3)",
      color: "border-yellow-200 bg-yellow-50",
      recommendations: [
        "Balanced Mediterranean-style diet",
        "Portion control with smaller, frequent meals",
        "Include whole grains and fiber-rich foods",
        "Regular consumption of fruits and vegetables",
        "Moderate amounts of lean protein",
        "Limit processed foods and added sugars"
      ]
    },
    {
      category: "Low Risk (Tier 1)",
      color: "border-green-200 bg-green-50",
      recommendations: [
        "Maintain balanced, varied diet",
        "Focus on whole, unprocessed foods",
        "Include plenty of fruits and vegetables",
        "Stay hydrated with water",
        "Regular meal timing",
        "Continue healthy eating habits"
      ]
    }
  ];

  const mealPlans = [
    {
      meal: "Breakfast",
      highRisk: "Greek yogurt with berries and nuts",
      moderateRisk: "Oatmeal with cinnamon and apple slices",
      lowRisk: "Whole grain toast with avocado"
    },
    {
      meal: "Lunch",
      highRisk: "Grilled salmon with quinoa and steamed vegetables",
      moderateRisk: "Chicken salad with mixed greens and olive oil dressing",
      lowRisk: "Turkey and vegetable wrap with whole grain tortilla"
    },
    {
      meal: "Dinner",
      highRisk: "Lean beef with roasted Brussels sprouts and sweet potato",
      moderateRisk: "Baked chicken with brown rice and green beans",
      lowRisk: "Pasta with vegetables and lean ground turkey"
    },
    {
      meal: "Snacks",
      highRisk: "Almonds and cucumber slices",
      moderateRisk: "Apple with peanut butter",
      lowRisk: "Yogurt with granola"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <UtensilsCrossed className="h-6 w-6 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Personalized Diet Plans</h2>
      </div>

      {/* Risk-Based Dietary Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dietRecommendations.map((plan, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-sm border-2 p-6 ${plan.color}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{plan.category}</h3>
            <ul className="space-y-3">
              {plan.recommendations.map((rec, recIndex) => (
                <li key={recIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Sample Meal Plans */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <Apple className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Sample Daily Meal Plans</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  High Risk (Tier 4-5)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moderate Risk (Tier 2-3)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Low Risk (Tier 1)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mealPlans.map((plan, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.meal}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {plan.highRisk}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {plan.moderateRisk}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {plan.lowRisk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nutritional Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Foods to Include</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Leafy greens (spinach, kale, arugula)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Lean proteins (fish, chicken, legumes)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Whole grains (quinoa, brown rice, oats)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Healthy fats (olive oil, avocado, nuts)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Low-GI fruits (berries, apples, pears)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Foods to Limit</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Refined sugars and sweets</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Processed and packaged foods</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">White bread and refined grains</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Sugary beverages and sodas</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">High-sodium processed meats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}