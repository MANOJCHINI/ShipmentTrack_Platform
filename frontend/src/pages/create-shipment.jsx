import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateShipment } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { shipmentsApi } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Truck,
  FileText,
  Boxes,
  User,
  Sparkles,
} from "lucide-react";

const STEPS = [
  {
    id: 0,
    label: "Package Information",
    icon: Package,
  },
  {
    id: 1,
    label: "Sender Information",
    icon: User,
  },
  {
    id: 2,
    label: "Receiver Information",
    icon: MapPin,
  },
  {
    id: 3,
    label: "Shipment Information",
    icon: Truck,
  },
];

const PACKAGE_TYPES = [
  {
    value: "BOX",
    label: "Box",
  },
  {
    value: "DOCUMENT",
    label: "Document",
  },
  {
    value: "PARCEL",
    label: "Parcel",
  },
  {
    value: "PALLET",
    label: "Pallet",
  },
  {
    value: "CRATE",
    label: "Crate",
  },
];

const SHIPMENT_TYPES = [
  {
    value: "STANDARD",
    label: "Standard",
  },
  {
    value: "EXPRESS",
    label: "Express",
  },
  {
    value: "SAME_DAY",
    label: "Same Day",
  },
  {
    value: "OVERNIGHT",
    label: "Overnight",
  },
];

const PRIORITIES = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
];

export function CreateShipmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createShipment = useCreateShipment();

  const [step, setStep] = useState(0);
  const [hubs, setHubs] = useState([]);

  /*
   * ============================================================
   * LOAD HUBS
   * ============================================================
   */
  useEffect(() => {
    const loadHubs = async () => {
      try {
        const data = await shipmentsApi.getHubs();

        setHubs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load hubs:", error);

        toast.error("Failed to load hubs");
      }
    };

    loadHubs();
  }, []);

  /*
   * ============================================================
   * DEFAULT SENDER INFORMATION
   * ============================================================
   */
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const defaultSenderName = user?.companyName ?? user?.company ?? fullName;

  const defaultSenderPhone = user?.phone ?? "";
  const defaultSenderEmail = user?.email ?? "";

  /*
   * ============================================================
   * FORM STATE
   * ============================================================
   */
  const [form, setForm] = useState({
    // Package
    packageDescription: "",
    packageType: "BOX",
    packageWeightKg: "",
    pieces: "",
    declaredValue: "",
    fragile: false,
    insured: false,

    // Sender
    senderName: defaultSenderName,
    senderPhone: defaultSenderPhone,
    senderEmail: defaultSenderEmail,
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderPostalCode: "",
    senderCountry: "INDIA",

    // Receiver
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverAddress: "",
    receiverCity: "",
    receiverState: "",
    receiverPostalCode: "",
    receiverCountry: "INDIA",

    // Shipment
    shipmentType: "STANDARD",
    priority: "NORMAL",

    estimatedDeliveryAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  });

  /*
   * ============================================================
   * UPDATE USER INFORMATION WHEN AUTH LOADS
   * ============================================================
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    const userFullName = `${user?.firstName ?? ""} ${
      user?.lastName ?? ""
    }`.trim();

    const userSenderName = user?.companyName ?? user?.company ?? userFullName;

    setForm((previous) => ({
      ...previous,

      senderName: previous.senderName || userSenderName || "",

      senderPhone: previous.senderPhone || user?.phone || "",

      senderEmail: previous.senderEmail || user?.email || "",
    }));
  }, [user]);

  /*
   * ============================================================
   * SELECTED VALUES
   * ============================================================
   */
  const selectedShipmentType = SHIPMENT_TYPES.find(
    (item) => item.value === form.shipmentType,
  );

  const selectedPriority = PRIORITIES.find(
    (item) => item.value === form.priority,
  );

  /*
   * ============================================================
   * GENERIC FORM UPDATE
   * ============================================================
   */
  const update = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */
  const canProceed = () => {
    /*
     * STEP 1
     * Package information
     */
    if (step === 0) {
      return (
        form.packageDescription.trim() !== "" &&
        Number(form.packageWeightKg) > 0 &&
        Number(form.pieces) > 0 &&
        Number(form.declaredValue) > 0
      );
    }

    /*
     * STEP 2
     * Sender information
     */
    if (step === 1) {
      return (
        form.senderName.trim() !== "" &&
        form.senderPhone.trim() !== "" &&
        form.senderAddress.trim() !== "" &&
        form.senderCity.trim() !== ""
      );
    }

    /*
     * STEP 3
     * Receiver information
     */
    if (step === 2) {
      return (
        form.receiverName.trim() !== "" &&
        form.receiverPhone.trim() !== "" &&
        form.receiverAddress.trim() !== "" &&
        form.receiverCity.trim() !== ""
      );
    }

    /*
     * STEP 4
     * Shipment information
     *
     * IMPORTANT:
     * priority is a STRING:
     *
     * "LOW"
     * "NORMAL"
     * "HIGH"
     * "URGENT"
     *
     * DO NOT use:
     *
     * form.priority > 0
     *
     * because that will always return false.
     */
    if (step === 3) {
      return Boolean(form.shipmentType && form.priority);
    }

    return true;
  };

  /*
   * ============================================================
   * NEXT STEP
   * ============================================================
   */
  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please complete all required fields before continuing.");

      return;
    }

    setStep((previous) => Math.min(previous + 1, STEPS.length - 1));
  };

  /*
   * ============================================================
   * PREVIOUS STEP
   * ============================================================
   */
  const handleBack = () => {
    setStep((previous) => Math.max(previous - 1, 0));
  };

  /*
   * ============================================================
   * SUBMIT SHIPMENT
   * ============================================================
   */
  const handleSubmit = async () => {
    /*
     * Check authentication first.
     */
    if (!user?.id) {
      toast.error("User not authenticated");

      return;
    }

    /*
     * Validate all required values one more time.
     */
    if (
      !form.packageDescription.trim() ||
      Number(form.packageWeightKg) <= 0 ||
      Number(form.pieces) <= 0
    ) {
      toast.error("Please complete the package information.");

      return;
    }

    if (
      !form.senderName.trim() ||
      !form.senderPhone.trim() ||
      !form.senderAddress.trim() ||
      !form.senderCity.trim()
    ) {
      toast.error("Please complete the sender information.");

      return;
    }

    if (
      !form.receiverName.trim() ||
      !form.receiverPhone.trim() ||
      !form.receiverAddress.trim() ||
      !form.receiverCity.trim()
    ) {
      toast.error("Please complete the receiver information.");

      return;
    }

    if (!form.shipmentType || !form.priority) {
      toast.error("Please select shipment type and priority.");

      return;
    }

    if (!form.declaredValue || Number(form.declaredValue) <= 0) {
      toast.error("Declared value must be greater than zero.");

      return;
    }

    /*
     * ============================================================
     * API PAYLOAD
     * ============================================================
     */
    const payload = {
      customerId: user.id,

      /*
       * ----------------------------------------------------------
       * SENDER
       * ----------------------------------------------------------
       */
      senderName: form.senderName,
      senderPhone: form.senderPhone,
      senderEmail: form.senderEmail,
      senderAddress: form.senderAddress,
      senderCity: form.senderCity,
      senderState: form.senderState,
      senderPostalCode: form.senderPostalCode,
      senderCountry: form.senderCountry,

      /*
       * ----------------------------------------------------------
       * RECEIVER
       * ----------------------------------------------------------
       */
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      receiverEmail: form.receiverEmail,
      receiverAddress: form.receiverAddress,
      receiverCity: form.receiverCity,
      receiverState: form.receiverState,
      receiverPostalCode: form.receiverPostalCode,
      receiverCountry: form.receiverCountry,

      /*
       * ----------------------------------------------------------
       * PACKAGE
       * ----------------------------------------------------------
       */
      packageType: form.packageType,
      packageDescription: form.packageDescription,

      packageWeightKg: Number(form.packageWeightKg),

      /*
       * IMPORTANT:
       * The original form collected pieces,
       * but the original payload did not send it.
       */
      pieces: Number(form.pieces),

      declaredValue: Number(form.declaredValue),

      fragile: Boolean(form.fragile),

      insured: Boolean(form.insured),

      codAmount: 0,

      /*
       * ----------------------------------------------------------
       * SHIPMENT
       * ----------------------------------------------------------
       */
      shipmentType: form.shipmentType,
      priority: form.priority,

      estimatedDeliveryAt: new Date(
        `${form.estimatedDeliveryAt}T00:00:00`,
      ).toISOString(),
    };

    /*
     * Debugging:
     * You can temporarily uncomment this if you want
     * to see exactly what is being sent to the backend.
     */
    

    try {
      await createShipment.mutateAsync(payload);

      toast.success("Shipment created successfully", {
        description: `Declared Value: ${formatCurrency(form.declaredValue)} · ${
          selectedShipmentType?.label ?? "Shipment"
        }`,
      });

      navigate("/app/shipments");
    } catch (error) {
      console.error("Failed to create shipment:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create shipment. Please try again.";

      toast.error(errorMessage);
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Shipment"
        description="Book a new shipment in a few simple steps"
        icon={Package}
      />

      {/* ==========================================================
          STEPS
      ========================================================== */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        {STEPS.map((item, index) => {
          const StepIcon = item.icon;

          const isDone = step > item.id;

          const isCurrent = step === item.id;

          return (
            <div key={item.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                    isDone && "bg-success text-white",
                    isCurrent && "gradient-brand text-white",
                    !isDone && !isCurrent && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>

                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    Step {item.id + 1}
                  </p>

                  <p
                    className={cn(
                      "text-xs",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </p>
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-0.5 flex-1 rounded-full",
                    isDone ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ==========================================================
          MAIN CONTENT
      ========================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {/* ======================================================
                STEP 0 - PACKAGE
            ====================================================== */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">Package Information</h3>

                  <p className="text-sm text-muted-foreground">
                    Tell us about the package you're shipping
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="packageDescription">
                    Package Description
                  </Label>

                  <Textarea
                    id="packageDescription"
                    value={form.packageDescription}
                    onChange={(event) =>
                      update("packageDescription", event.target.value)
                    }
                    placeholder="e.g. Electronics, documents, etc."
                    rows={2}
                  />
                </div>

                {/* Package Type */}
                <div className="space-y-2">
                  <Label htmlFor="packageType">Package Type</Label>

                  <Select
                    value={form.packageType}
                    onValueChange={(value) => update("packageType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>

                    <SelectContent>
                      {PACKAGE_TYPES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Weight / Pieces / Value */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="packageWeightKg">Weight (kg)</Label>

                    <Input
                      id="packageWeightKg"
                      type="number"
                      value={form.packageWeightKg}
                      onChange={(event) =>
                        update("packageWeightKg", event.target.value)
                      }
                      min="0.1"
                      step="0.1"
                      placeholder="0"
                    />
                  </div>

                  {/* Pieces */}
                  <div className="space-y-2">
                    <Label htmlFor="pieces">Pieces</Label>

                    <Input
                      id="pieces"
                      type="number"
                      value={form.pieces}
                      onChange={(event) => update("pieces", event.target.value)}
                      min="1"
                      step="1"
                      placeholder="1"
                    />
                  </div>

                  {/* Declared Value */}
                  <div className="space-y-2">
                    <Label htmlFor="declaredValue">Declared Value (₹)</Label>

                    <Input
                      id="declaredValue"
                      type="number"
                      value={form.declaredValue}
                      onChange={(event) =>
                        update("declaredValue", event.target.value)
                      }
                      min="1"
                      step="1"
                      placeholder="0"
                    />
                  </div>
                </div>

                
              </div>
            )}

            {/* ======================================================
                STEP 1 - SENDER
            ====================================================== */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">Sender Information</h3>

                  <p className="text-sm text-muted-foreground">
                    Who is sending this package?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Sender Name */}
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Full Name</Label>

                    <Input
                      id="senderName"
                      value={form.senderName}
                      onChange={(event) =>
                        update("senderName", event.target.value.toUpperCase())
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="senderPhone">Phone</Label>

                    <Input
                      id="senderPhone"
                      value={form.senderPhone}
                      onChange={(event) =>
                        update("senderPhone", event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Email</Label>

                  <Input
                    id="senderEmail"
                    type="email"
                    value={form.senderEmail}
                    onChange={(event) =>
                      update("senderEmail", event.target.value)
                    }
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="senderAddress">Address</Label>

                  <Input
                    id="senderAddress"
                    value={form.senderAddress}
                    onChange={(event) =>
                      update("senderAddress", event.target.value)
                    }
                  />
                </div>

                {/* City / State */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="senderCity">City</Label>

                    <Select
                      value={form.senderCity}
                      onValueChange={(value) => {
                        const hub = hubs.find((item) => item.city === value);

                        if (!hub) {
                          return;
                        }

                        setForm((previous) => ({
                          ...previous,
                          senderCity: hub.city,
                          senderState: hub.state,
                          senderPostalCode: hub.pincode,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>

                      <SelectContent>
                        {hubs.map((hub) => (
                          <SelectItem key={hub.id} value={hub.city}>
                            {hub.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="senderState">State</Label>

                    <Input id="senderState" value={form.senderState} disabled />
                  </div>
                </div>

                {/* Postal / Country */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Postal */}
                  <div className="space-y-2">
                    <Label htmlFor="senderPostalCode">Postal Code</Label>

                    <Input
                      id="senderPostalCode"
                      value={form.senderPostalCode}
                      disabled
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="senderCountry">Country</Label>

                    <Input
                      id="senderCountry"
                      value={form.senderCountry}
                      onChange={(event) =>
                        update("senderCountry", event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================
                STEP 2 - RECEIVER
            ====================================================== */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">
                    Receiver Information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Who is receiving this package?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Receiver Name */}
                  <div className="space-y-2">
                    <Label htmlFor="receiverName">Full Name</Label>

                    <Input
                      id="receiverName"
                      value={form.receiverName}
                      onChange={(event) =>
                        update("receiverName", event.target.value.toUpperCase())
                      }
                    />
                  </div>

                  {/* Receiver Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="receiverPhone">Phone</Label>

                    <Input
                      id="receiverPhone"
                      value={form.receiverPhone}
                      onChange={(event) =>
                        update("receiverPhone", event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="receiverEmail">Email</Label>

                  <Input
                    id="receiverEmail"
                    type="email"
                    value={form.receiverEmail}
                    onChange={(event) =>
                      update("receiverEmail", event.target.value)
                    }
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="receiverAddress">Address</Label>

                  <Input
                    id="receiverAddress"
                    value={form.receiverAddress}
                    onChange={(event) =>
                      update("receiverAddress", event.target.value)
                    }
                  />
                </div>

                {/* City / State */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="receiverCity">City</Label>

                    <Select
                      value={form.receiverCity}
                      onValueChange={(value) => {
                        const hub = hubs.find((item) => item.city === value);

                        if (!hub) {
                          return;
                        }

                        setForm((previous) => ({
                          ...previous,
                          receiverCity: hub.city,
                          receiverState: hub.state,
                          receiverPostalCode: hub.pincode,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>

                      <SelectContent>
                        {hubs.map((hub) => (
                          <SelectItem key={hub.id} value={hub.city}>
                            {hub.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="receiverState">State</Label>

                    <Input
                      id="receiverState"
                      value={form.receiverState}
                      disabled
                    />
                  </div>
                </div>

                {/* Postal / Country */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Postal */}
                  <div className="space-y-2">
                    <Label htmlFor="receiverPostalCode">Postal Code</Label>

                    <Input
                      id="receiverPostalCode"
                      value={form.receiverPostalCode}
                      disabled
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="receiverCountry">Country</Label>

                    <Input
                      id="receiverCountry"
                      value={form.receiverCountry}
                      onChange={(event) =>
                        update("receiverCountry", event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================
                STEP 3 - SHIPMENT INFORMATION
            ====================================================== */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">
                    Shipment Information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Choose service type and priority
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Shipment Type */}
                  <div className="space-y-2">
                    <Label htmlFor="shipmentType">Shipment Type</Label>

                    <Select
                      value={form.shipmentType}
                      onValueChange={(value) => update("shipmentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipment type" />
                      </SelectTrigger>

                      <SelectContent>
                        {SHIPMENT_TYPES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>

                    <Select
                      value={form.priority}
                      onValueChange={(value) => update("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent>
                        {PRIORITIES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDeliveryAt">
                      Estimated Delivery Date
                    </Label>

                    <Input
                      id="estimatedDeliveryAt"
                      type="date"
                      value={form.estimatedDeliveryAt}
                      onChange={(event) =>
                        update("estimatedDeliveryAt", event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* ==================================================
                    REVIEW
                ================================================== */}
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                    Review Your Shipment
                  </h4>

                  <div className="space-y-3">
                    <ReviewRow
                      label="Package"
                      value={form.packageDescription || "—"}
                    />

                    <ReviewRow
                      label="Package Type"
                      value={
                        PACKAGE_TYPES.find(
                          (item) => item.value === form.packageType,
                        )?.label || "—"
                      }
                    />

                    <ReviewRow label="Sender" value={form.senderName || "—"} />

                    <ReviewRow
                      label="Receiver"
                      value={form.receiverName || "—"}
                    />

                    <ReviewRow
                      label="Shipment Type"
                      value={selectedShipmentType?.label || "—"}
                    />

                    <ReviewRow
                      label="Priority"
                      value={selectedPriority?.label || "—"}
                    />

                    <ReviewRow
                      label="Declared Value"
                      value={
                        form.declaredValue
                          ? formatCurrency(form.declaredValue)
                          : "—"
                      }
                    />

                    <ReviewRow
                      label="Weight"
                      value={
                        form.packageWeightKg
                          ? `${form.packageWeightKg} kg`
                          : "—"
                      }
                    />

                    <ReviewRow
                      label="Pieces"
                      value={form.pieces ? String(form.pieces) : "—"}
                    />

                    <ReviewRow
                      label="Delivery Date"
                      value={form.estimatedDeliveryAt || "—"}
                    />
                  </div>

                  {/* ==================================================
                      ESTIMATED COST
                  ================================================== */}
                  <div className="mt-4 rounded-xl border border-success/30 bg-success/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-success">
                        <Sparkles className="h-4 w-4" />
                        Estimated Cost
                      </span>

                      <span className="text-2xl font-bold text-success">
                        {form.declaredValue
                          ? formatCurrency(form.declaredValue)
                          : "₹0"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Cost is currently based on the declared value.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================
                NAVIGATION
            ====================================================== */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              {/* BACK */}
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0 || createShipment.isPending}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Button>

              {/* CONTINUE */}
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || createShipment.isPending}
                >
                  Continue
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                /*
                 * ==================================================
                 * CONFIRM & BOOK
                 *
                 * THIS IS THE IMPORTANT PART.
                 *
                 * canProceed() now returns true when:
                 *
                 * form.shipmentType = "STANDARD"
                 * form.priority = "NORMAL"
                 *
                 * We no longer do:
                 *
                 * form.priority > 0
                 *
                 * ==================================================
                 */
                <Button
                  onClick={handleSubmit}
                  disabled={createShipment.isPending || !canProceed()}
                >
                  <Check className="mr-1.5 h-4 w-4" />

                  {createShipment.isPending ? "Creating..." : "Confirm & Book"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ==========================================================
            SIDEBAR
        ========================================================== */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                Shipment Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <SummaryRow label="Sender" value={form.senderName || "—"} />

              <SummaryRow label="Receiver" value={form.receiverName || "—"} />

              <SummaryRow
                label="Package Type"
                value={
                  PACKAGE_TYPES.find((item) => item.value === form.packageType)
                    ?.label || "—"
                }
              />

              <SummaryRow
                label="Weight"
                value={
                  form.packageWeightKg ? `${form.packageWeightKg} kg` : "—"
                }
              />

              <SummaryRow
                label="Pieces"
                value={form.pieces ? String(form.pieces) : "—"}
              />

              <SummaryRow
                label="Declared Value"
                value={
                  form.declaredValue ? formatCurrency(form.declaredValue) : "₹0"
                }
              />

              <SummaryRow
                label="Shipment Type"
                value={selectedShipmentType?.label || "—"}
              />

              <SummaryRow
                label="Priority"
                value={selectedPriority?.label || "—"}
              />

              {/* Cost */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Est. Cost
                  </span>

                  <span className="text-xl font-bold text-success">
                    {form.declaredValue
                      ? formatCurrency(form.declaredValue)
                      : "₹0"}
                  </span>
                </div>
              </div>

              {/* Step */}
              <div className="rounded-lg bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5" />
                  Step {step + 1} of {STEPS.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/*
 * ================================================================
 * REVIEW ROW
 * ================================================================
 */
function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="max-w-[60%] text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}

/*
 * ================================================================
 * SUMMARY ROW
 * ================================================================
 */
function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>

      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
