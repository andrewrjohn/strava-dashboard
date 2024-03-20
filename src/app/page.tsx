import { COOKIES } from "./lib/constants";
import { cookies } from "next/headers";
import { getActivities, getAthleteStats } from "./actions/strava";
import Navbar from "./components/Navbar";
import { redirect } from "next/navigation";
import { miles } from "./lib/numbers";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { format } from "date-fns";

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);
  return `${hours ? `${hours}:` : ""}${minutes}:${secondsLeft
    .toString()
    .padEnd(2, "0")}`;
}

function getPace(distance: number, time: number) {
  const pace = time / miles(distance);
  return formatTime(pace);
}

export default async function Home() {
  const athleteId = cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value;

  if (!athleteId) {
    redirect("/login");
  }

  const stats = await getAthleteStats();

  const activities = await getActivities();
  return (
    <main>
      <Navbar />

      <div className="container mt-4">
        <h2 className="text-2xl dark:text-dark-tremor-content-emphasis">
          This Month
        </h2>
        <div className="flex items-center justify-between gap-10 mt-4">
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Runs
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {stats.recent_run_totals.count}
            </p>
          </Card>
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Miles Ran
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {miles(stats.recent_run_totals.distance).toFixed(2)}
            </p>
          </Card>
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Time Spent
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {formatTime(stats.recent_run_totals.moving_time)}
            </p>
          </Card>
        </div>
        <h2 className="text-2xl dark:text-dark-tremor-content-emphasis mt-8">
          Year to Date
        </h2>
        <div className="flex items-center justify-between gap-10 mt-4">
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Runs
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {stats.ytd_run_totals.count}
            </p>
          </Card>
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Miles Ran
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {miles(stats.ytd_run_totals.distance).toFixed(2)}
            </p>
          </Card>
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Time Spent
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {formatTime(stats.ytd_run_totals.moving_time)}
            </p>
          </Card>
        </div>
        <h2 className="text-2xl dark:text-dark-tremor-content-emphasis mt-8">
          Lifetime
        </h2>
        <div className="flex items-center justify-between gap-10 mt-4">
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Runs
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {stats.all_run_totals.count}
            </p>
          </Card>
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Miles Ran
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {miles(stats.all_run_totals.distance).toFixed(2)}
            </p>
          </Card>
          <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Time Spent
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {formatTime(stats.all_run_totals.moving_time)}
            </p>
          </Card>
        </div>
        <div>
          <Table className="mt-8">
            <TableHead>
              <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Distance
                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Time
                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Pace
                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Date
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities
                .filter((a) => a.sport_type.toLowerCase().includes("run"))
                .sort(
                  (a, b) => +new Date(b.start_date) - +new Date(a.start_date)
                )
                .map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {miles(a.distance).toFixed(2)} mi
                    </TableCell>
                    <TableCell>{formatTime(a.moving_time)}</TableCell>
                    <TableCell>
                      {getPace(a.distance, a.moving_time)} /mi
                    </TableCell>
                    <TableCell>
                      {format(new Date(a.start_date), "MM/dd/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
