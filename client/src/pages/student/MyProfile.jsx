import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import CourseSkeleton from "@/components/CourseSkeleton";
import Course from "@/components/Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const MyProfile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const { data, isLoading, refetch } = useLoadUserQuery();

  const [
    updateUser,
    {
      data: updatedUserData,
      isLoading: updatedUserLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();
  useEffect(() => {
    if (isSuccess) {
      toast.success(updatedUserData.message || "Profile updated.");
      refetch();
    }
    if (isError) {
      toast.error(error.data.message || "Failed to updated profile");
    }
  }, [updatedUserData, isSuccess, isError]);
  if (isLoading) return <h1>Profile Loading...</h1>;

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
   
  };
  const updatedUserHandler = async () => {
    console.log(name, profilePhoto);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };
  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 my-5">
        <div>
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              className="h-24 w-24 md:h-32 md:w-32 rounded-full "
              src={data?.data?.photoUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {data?.data?.name}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {data?.data?.email}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {data?.data?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog variant="secondary">
            <form>
              <DialogTrigger asChild>
                <Button size="sm" className="mt-2">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-cols-4 items-center gap-4">
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-cols-4 items-center gap-4">
                    <Label>Profile picture</Label>
                    <input
                      onChange={onChangeHandler}
                      accept="image/"
                      type="file"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    disabled={updatedUserLoading}
                    type="submit"
                    onClick={updatedUserHandler}
                  >
                    {updatedUserLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      <>Save changes</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg mb-3">
          Courses your're enrolled in
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data?.data?.enrolledCourses.length === 0 ? (
            <p>You haven't enrolled any courses</p>
          ) : isLoading ? (
            Array.from({ length: 4 }).map((_, ind) => (
              <CourseSkeleton key={ind} />
            ))
          ) : (
            Array.from({ length: 4 }).map((_, ind) => <Course key={ind} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
