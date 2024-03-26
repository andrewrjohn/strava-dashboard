import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  runCount: number;
  miles: string;
  time: string;
}

export default function Summary(props: Props) {
  const { runCount, miles, time } = props;

  return (
    <div className="flex items-center gap-10 mt-2 w-full">
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Runs
        </h4>
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {runCount}
        </p>
      </Card>
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Miles Ran
        </h4>
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {miles}
        </p>
      </Card>
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Time Spent
        </h4>
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {time}
        </p>
      </Card>
    </div>
  );
}
