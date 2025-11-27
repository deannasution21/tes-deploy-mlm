import cn from "@core/utils/class-names";
import { Badge, Flex, Text } from "rizzui";
import { replaceUnderscoreDash } from "@core/utils/replace-underscore-dash";

const statusColors = {
  success: ["text-green-dark", "bg-green-dark"],
  warning: ["text-orange-dark", "bg-orange-dark"],
  danger: ["text-red-dark", "bg-red-dark"],
  default: ["text-gray-600", "bg-gray-600"],
  blue: ["text-blue-600", "bg-blue-400"],
  yellow: ["text-yellow-600", "bg-yellow-400"],
  green: ["text-green-600", "bg-green-400"],
  red: ["text-red-600", "bg-red-400"],
  purple: ["text-purple-600", "bg-purple-400"],
  pink: ["text-pink-600", "bg-pink-400"],
  indigo: ["text-indigo-600", "bg-indigo-400"],
};

const allStatus = {
  online: statusColors.success,
  offline: statusColors.default,
  pending: statusColors.warning,
  paid: statusColors.success,
  overdue: statusColors.danger,
  completed: statusColors.success,
  cancelled: statusColors.danger,
  publish: statusColors.success,
  approved: statusColors.success,
  rejected: statusColors.danger,
  active: statusColors.success,
  deactivated: statusColors.danger,
  used: statusColors.danger,
  on_going: statusColors.warning,
  at_risk: statusColors.danger,
  delayed: statusColors.default,
  draft: statusColors.default,
  refunded: statusColors.default,
  SUCCESS: statusColors.success,
  FAILED: statusColors.danger,
  BLUE: statusColors.blue,
  "0": statusColors.warning,
  "1": statusColors.success,
  "-2": statusColors.danger,
  "2": statusColors.success,
  infinity_emperor: statusColors.yellow,
  global_ambassador: statusColors.blue,
  grand_director: statusColors.green,
  prestige_leader: statusColors.red,
  royal_achiever: statusColors.purple,
  elite_builder: statusColors.pink,
  starter_member: statusColors.indigo,
};

export type StatusTypes = keyof typeof allStatus;

export function getStatusBadge(status: string) {
  const statusLower =
    status === "0"
      ? "pending"
      : status === "-2"
        ? "overdue"
        : status === "1"
          ? "BLUE"
          : status === "2"
            ? "online"
            : (status.toLowerCase() as StatusTypes);
  if (statusLower in allStatus) {
    return (
      <Flex align="center" gap="2" className="w-auto">
        <Badge renderAsDot className={allStatus[statusLower][1]} />
        <Text
          className={cn(
            "font-medium text-[12px] uppercase",
            allStatus[statusLower][0]
          )}
        >
          {status === "0"
            ? "Menunggu Pembayaran"
            : status === "1"
              ? "Pembayaran Berhasil"
              : status === "-2"
                ? "Transaksi Dibatalkan/Expired"
                : status === "2"
                  ? "Transaksi Telah Diproses dan Dikirim"
                  : status === "used"
                    ? "Sudah Digunakan"
                    : status === "active"
                      ? "Belum Digunakan"
                      : replaceUnderscoreDash(statusLower)}
        </Text>
      </Flex>
    );
  }
  return (
    <Flex align="center" gap="2" className="w-auto">
      {/* <Badge renderAsDot className="bg-gray-600" /> */}
      <Badge renderAsDot className="bg-green-dark min-w-2" />
      {/* <Text className="font-medium capitalize text-gray-600"> */}
      <Text className="font-medium text-[12px] uppercase text-green-dark">
        {replaceUnderscoreDash(statusLower)}
      </Text>
    </Flex>
  );
}
