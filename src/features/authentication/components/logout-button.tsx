import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/authentication/server/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline">
        Sign out
      </Button>
    </form>
  );
}
