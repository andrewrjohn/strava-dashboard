import { COOKIES } from "./lib/constants";
import { cookies } from "next/headers";
import { getActivities, getAthleteStats } from "./actions";
import Navbar from "./components/Navbar";
import { redirect } from "next/navigation";
import { formatTime, miles } from "./lib/numbers";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "@/components/summary";
import ActivityTable from "@/components/activity-table";

function getCurrentMonthName() {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  return month;
}

export default async function Home() {
  const athleteId = cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value;

  if (!athleteId) {
    redirect("/login");
  }

  const stats = await getAthleteStats();

  const activities = (await getActivities()).filter((a) =>
    a.sport_type.toLowerCase().includes("run")
  );
  return (
    <main className="pb-20">
      <Navbar />

      <div className="mt-">
        <Tabs defaultValue="month">
          <TabsList className="mb-4">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="ytd">Year to Date</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>
          <TabsContent value="month">
            <h2 className="text-2xl dark:text-dark-tremor-content-emphasis">
              {getCurrentMonthName()}
            </h2>
            <Summary
              runCount={stats.recent_run_totals.count}
              miles={miles(stats.recent_run_totals.distance).toFixed(2)}
              time={formatTime(stats.recent_run_totals.moving_time)}
            />
          </TabsContent>
          <TabsContent value="ytd">
            <h2 className="text-2xl dark:text-dark-tremor-content-emphasis">
              {new Date().getFullYear()}
            </h2>
            <Summary
              runCount={stats.ytd_run_totals.count}
              miles={miles(stats.ytd_run_totals.distance).toFixed(2)}
              time={formatTime(stats.ytd_run_totals.moving_time)}
            />
          </TabsContent>
          <TabsContent value="lifetime">
            <h2 className="text-2xl dark:text-dark-tremor-content-emphasis">
              Lifetime
            </h2>
            <Summary
              runCount={stats.all_run_totals.count}
              miles={miles(stats.all_run_totals.distance).toFixed(2)}
              time={formatTime(stats.all_run_totals.moving_time)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          {/* <Table className="mt-8">
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
          </Table> */}
          <h2 className="text-2xl dark:text-dark-tremor-content-emphasis mt-8 mb-2">
            Runs
          </h2>
          <ActivityTable activities={activities} />
        </div>
      </div>
    </main>
  );
}
