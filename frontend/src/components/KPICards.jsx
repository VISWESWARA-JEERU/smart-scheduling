import {
  PhoneCall,
  CalendarDays,
  Headset,
  Info,
  Activity,
  CircleX
} from "lucide-react";

function KPICards({ data = {}, requestData = [] }) {
  const totalRequests = Number(data?.total_requests || 0);

  const getRequestTotal = (requestName) => {
    return Number(
      requestData.find((item) => item.user_request === requestName)?.total || 0
    );
  };

  const getPercentage = (value) => {
    if (!totalRequests) return "0.00";
    return ((value / totalRequests) * 100).toFixed(2);
  };

  const appointmentTotal = getRequestTotal("Appointment Confirmation/Inquiry");

  const frontDeskTotal = getRequestTotal("Front Desk Request");

  const silentCallTotal = getRequestTotal("No User Request (Silent Call)");

  const cards = [
    {
      title: "Total Requests",
      value: totalRequests,
      subtitle: "100% of calls",
      Icon: PhoneCall,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      lineColor: "text-blue-600",
    },

    {
      title: "Appointment Confirmation",
      value: appointmentTotal,
      subtitle: `${getPercentage(appointmentTotal)}% of calls`,
      Icon: CalendarDays,
      bg: "bg-green-50",
      border: "border-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      lineColor: "text-green-600",
    },

    {
      title: "Front Desk Requests",
      value: frontDeskTotal,
      subtitle: `${getPercentage(frontDeskTotal)}% of calls`,
      Icon: Headset,
      bg: "bg-purple-50",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      lineColor: "text-purple-600",
    },

    {
      title: "No User Request",
      value: silentCallTotal,
      subtitle: `${getPercentage(silentCallTotal)}% of calls`,
      Icon: CircleX,
      bg: "bg-red-50",
      border: "border-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      lineColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.Icon;

        return (
          <div
            key={card.title}
            className={`h-[150px] rounded-2xl border ${card.border} ${card.bg} px-5 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex h-full items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.iconBg}`}
                >
                  <Icon
                    size={32}
                    strokeWidth={1.8}
                    className={card.iconColor}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-700">
                      {card.title}
                    </h3>

                    <Info
                      size={14}
                      strokeWidth={1.8}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="mt-2 text-4xl font-bold leading-none text-slate-900">
                    {card.value}
                  </p>

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Side Trend Icon */}
              <Activity
                size={42}
                strokeWidth={1.5}
                className={card.lineColor}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KPICards;