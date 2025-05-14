"use client";

// Importing necessary dependencies
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context"
import ChatBot  from "./ChatBox"; // Importing the ChatBot component





// Interface for user data
interface User {
  name: string;
  email: string;
}

/**
 * DashboardPage component
 * Renders a user dashboard with a customizable QR code containing user information
 * Features include QR code generation, copying, downloading, and customization options
 */
export default function DashboardPage() {
  // Initialize Next.js router
  const router = useRouter();

  // State management
  // const [user, setUser] = useState<User | null>({name: "Maaz Ahmed", email: "mail@"}); // Current user data
  const { user, logout, loading } = useAuth()

  // const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [copied, setCopied] = useState(false); // Tracks if QR code URL was copied
  const [qrColor, setQrColor] = useState("#2d4ea3"); // QR code foreground color
  const [qrSize, setQrSize] = useState(200); // QR code size in pixels

  /**
   * Effect hook to check user authentication status
   * Simulates fetching user data and redirects to login if not authenticated
   */
  useEffect(() => {
    const checkUser = () => {
      try {
        // Ensure window is defined (client-side only)
        if (typeof window !== "undefined") {
          // const storedUser = localStorage.getItem("user");

          // if (storedUser) {
          //   // setUser(JSON.parse(storedUser));
          //   alert("User found in local storage");
          //   setUser({name: "Maaz Ahmed", email: "mail@"})
          // } else {
          //   router.push("/login");
          // }
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/login");
      } finally {
        // setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  /**
   * Copies the QR code URL to clipboard
   * Shows a temporary confirmation and simple alert notification
   */
  const copyToClipboard = () => {
    if (!user) return;

    try {
      const qrValue = generateQrValue();
      navigator.clipboard.writeText(qrValue);
      setCopied(true);
      alert("QR code link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  /**
   * Downloads the QR code as an SVG file
   * Uses the SVG element from the QR code component
   */
  const downloadQRCode = () => {
    try {
      const canvas = document.querySelector(".qrcode-container svg") as SVGElement;
      if (!canvas) return;

      const svgData = new XMLSerializer().serializeToString(canvas);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode-${user?.email?.split("@")[0] || "user"}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  /**
   * Generates the QR code value with encoded user information
   * @returns {string} Base64 encoded URL with user data
   */
  const generateQrValue = () => {
    return `https://example.com/user/${btoa(
      JSON.stringify({
        name: user?.username || "User",
        email: user?.email,
        // company: "Example Company",
        // title: "User",
        // website: "https://example.com",
        // qrCreated: new Date().toISOString(),
      })
    )}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
      </div>
    );
  }

  // Return null if no user (router will handle redirect)
  if (!user) {
    return <h1>No User Found</h1>;
  }

  // Generate QR code value
  const qrValue = generateQrValue();
  console.log("user: ", user);
  return (
    <div className="flex min-h-screen  bg-[#f2f2f2]">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 pb-8 w-[70%] m-auto mt-10">
          {/* Page Header */}
          <div className="bg-white shadow rounded-md">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                    Mr. Maaz Ahmed
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {/* Welcome back, {user.name || user.email}. Here's what's happening with your account today. */}
                    Welcome back, Maaz Ahmed! Here's a quick overview of your account activity and updates for today.
                  </p>
                </div>
                <div className="mt-4 flex sm:mt-0">
                  <Button
                    variant="outline"
                    className="ml-3 inline-flex items-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-red-500 border-red-500 shadow-sm hover:bg-transparent hover:text-red-700 hover:border-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* QR Code Display and Settings */}
                <div className="lg:col-span-2">
                  <Card className="bg-white border-none shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <QrCode className="h-5 w-5 text-brand-blue" />
                        Your Unique QR Code
                      </CardTitle>
                      <CardDescription>
                        This QR code is uniquely generated based on your account information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col  justify-center space-y-6 border-none">
                      <div className="flex  items-center ">
                        {/* QR Code Display */}
                        <div className="qrcode-container rounded-lg bg-brand-blue p-2 mt-4 shadow-sm flex justify-center items-center">
                          <QRCodeSVG
                            value={qrValue}
                            size={qrSize}
                            level="H"
                            includeMargin
                            bgColor="#FFFFFF"
                            fgColor={qrColor}
                          />
                        </div>
                        {/* QR Code Settings */}
                        <div className="ml-10 w-[30%]">
                          <CardTitle className="text-gray-900">QR Code Settings</CardTitle>
                          <CardDescription>Customize your QR code appearance</CardDescription>
                          <br />
                          <div className="space-y-2">
                            <Label htmlFor="qr-color" className="text-sm font-medium text-gray-700">
                              QR Code Color
                            </Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                id="qr-color"
                                value={qrColor}
                                onChange={(e) => setQrColor(e.target.value)}
                                className="h-10 w-10 cursor-pointer rounded-md border"
                              />
                              <span className="text-sm text-gray-500">{qrColor}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qr-size" className="text-sm font-medium text-gray-700">
                              QR Code Size
                            </Label>
                            <Select value={qrSize.toString()} onValueChange={(value) => setQrSize(Number(value))}>
                              <SelectTrigger id="qr-size" className="w-full bg-white text-brand-blue">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="150">Small (150px)</SelectItem>
                                <SelectItem value="200">Medium (200px)</SelectItem>
                                <SelectItem value="250">Large (250px)</SelectItem>
                                <SelectItem value="300">Extra Large (300px)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      {/* QR Code URL and Copy Button */}
                      {/* <div className="w-full space-y-4">
                        <div className="flex items-center justify-between rounded-md border p-3">
                          <code className="text-sm text-gray-600">{qrValue.substring(0, 50)}...</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyToClipboard}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div> */}

                      <div className=" px-0 border-none w-full">
                        <CardHeader className="px-0" >
                          <CardTitle className="text-gray-900">User Info Card</CardTitle>
                          <CardDescription>Information encoded in your QR code</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0" >
                          <div className="rounded-md border bg-gray-50 p-4">
                            <pre className="text-xs text-gray-600">
                              {JSON.stringify(
                                {
                                  name: user.username || "User",
                                  email: user.email,
                                  // company: "Example Company",
                                  // title: "User",
                                  // website: "https://example.com",
                                  // qrCreated: new Date().toISOString(),
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            This information is encoded in your QR code for easy sharing
                          </p>
                        </CardContent>
                      </div>

                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-4 border-t bg-gray-50 px-6  border-none">
                      <Button
                        variant="outline"
                        className="flex-1 border-brand-blue text-white bg-brand-blue hover:bg-brand-blue-dark"
                        onClick={downloadQRCode}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download QR Code
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                {/* Digital Business Card Info */}
                <div>
                  <Card className="bg-white border-none shadow h-full flex flex-col relative rounded-md">
                    {/* <CardHeader>
                      <CardTitle className="text-gray-900">Ask me</CardTitle>
                      <CardDescription>Chat Smarter with AI That Understands You</CardDescription>
                    </CardHeader> */}
                    <CardContent className=" h-full  absolute bottom-0 top-0 left-0 right-0 p-4 pt-0 " >
                      <ChatBot />
                    </CardContent>
                  </Card>

                  {/* <Card className="bg-white border-none shadow mt-6 h-[330px]">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Digital Business Card</CardTitle>
                      <CardDescription>Information encoded in your QR code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border bg-gray-50 p-4">
                        <pre className="text-xs text-gray-600">
                          {JSON.stringify(
                            {
                              name: user.name || "User",
                              email: user.email,
                              // company: "Example Company",
                              // title: "User",
                              // website: "https://example.com",
                              qrCreated: new Date().toISOString(),
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        This information is encoded in your QR code for easy sharing
                      </p>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}