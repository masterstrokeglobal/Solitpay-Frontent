"use client";

import { Separator } from "@/components/ui/separator";
import { useCreateEmployee } from "@/features/employee/api/employee-query";
import EmployeeForm, { EmployeeFormValues } from "@/features/employee/components/employee-form";
import { useRouter } from "next/navigation";

const defaultValues: EmployeeFormValues = {
    name: "",
    email: "",
    password: "",
};

const CreateEmployeePage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateEmployee();

    const onSubmit = (data: EmployeeFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/employee");
            },
        });
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <div className="border-white/20 bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white">Create Employee</h3>
                        <p className="text-sm text-white/70">
                            Add a new employee to the system
                        </p>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="max-w-2xl">
                        <EmployeeForm
                            onSubmit={onSubmit}
                            isLoading={isPending}
                            defaultValues={defaultValues}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateEmployeePage;