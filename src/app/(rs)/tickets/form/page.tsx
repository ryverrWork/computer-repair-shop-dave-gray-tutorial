import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { Users, init as kindeInit } from "@kinde/management-api-js";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId) return {
    title: "Missing Ticket ID or Customer ID"
  }

  if (customerId) return {
    title: `New Ticket for Customer #${customerId}`
  }

  if (ticketId) return {
    title: `Edit Ticket #${ticketId}`
  }
}

export default async function TicketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  let customer = null;
  let ticket = null;
  let errorMessage: string | null = null;

  try {
    if (!customerId && !ticketId) {
      errorMessage = "Ticket ID or Customer ID required to load ticket form";
    }

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);
    const isManager = managerPermission?.isGranted;

    // New ticket form
    if (customerId) {
      customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        errorMessage = `Customer ID #${customerId} not found`;
      } else if (!customer.active) {
        errorMessage = `Customer ID #${customerId} is not active`;
      }

      if (isManager) {
        kindeInit(); // Initializes the Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return <TicketForm customer={customer} techs={techs} />;
      } else {
        return <TicketForm customer={customer} />;
      }
    }

    if (ticketId) {
      ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        errorMessage = `Ticket ID #${ticketId} not found`;
      } else {
        customer = await getCustomer(ticket.customerId);
      }

      if (isManager) {
        kindeInit(); // Initializes the Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return <TicketForm customer={customer} ticket={ticket} techs={techs} />;
      } else {
        const isEditable =
          user?.email?.toLowerCase() === ticket.tech.toLowerCase();
        console.log("ue: ", user?.email);
        console.log("tech: ", ticket.tech);
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }

  if (errorMessage) {
    return (
      <>
        <h2 className="text-2xl mb-2">{errorMessage}</h2>
        <BackButton title="Go Back" variant="default" />
      </>
    );
  }
}
