"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import { consumeCredits } from "@/actions/consume-action"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactCompareImage from "react-compare-image"

// Mock image transformations
const mockTransformations = {
  "remove-background": {
    before: "/demo/bg-remove-before.jpg",
    after: "/demo/bg-remove-after.png",
    cost: 2,
    description: "Remove the background from your image",
  },
  "enhance": {
    before: "/demo/low-quality.jpg",
    after: "/demo/high-quality.jpg",
    cost: 3,
    description: "Enhance image quality and resolution",
  },
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<string>("remove-background")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null)
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()

  const currentTransformation = mockTransformations[activeTab as keyof typeof mockTransformations]

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setShowResult(false)
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setUploadedFile(e.target.files[0])
  //     setShowResult(false)
  //   }
  // }

  useEffect(() => {
    if (session?.user) {
      setRemainingCredits(session.user.credits || null)
    }
  }, [session])

  const handleProcess = async () => {
    if (!session?.user) {
      toast.error("You must be signed in to process an image.")
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Consume credits
      const result = await consumeCredits(currentTransformation.cost)
      
      if (result.success) {
        setRemainingCredits(result.credits)
        setShowResult(true)
        toast.success(`Image processed successfully! ${currentTransformation.cost} credits used.`)
        
        // Update the session data to reflect the new credit balance
        if (session?.user) {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              credits: result.credits
            }
          })
        }
      } else {
        if (result.message === "Insufficient credits") {
          toast.error("You don't have enough credits. Please purchase more.")
          router.push("/pricing")
        } else {
          toast.error(result.message || "Failed to process image")
        }
      }
    } catch (error) {
      toast.error("An error occurred while processing your image")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AI Image Edit Demo</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Each transformation consumes credits from your account. (only for demo purpose, not really calling AI services)
        </p>
      </div>

      <div className="mx-auto max-w-2xl mt-10">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="remove-background">Remove Background</TabsTrigger>
            <TabsTrigger value="enhance">Enhance Quality</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{activeTab === "remove-background" ? "Remove Background" : "Enhance Quality"}</CardTitle>
                <CardDescription>
                  {currentTransformation.description} - <span className="font-semibold">{currentTransformation.cost} credits</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="grid gap-6 w-[600px] h-[400px]">
                  {/* <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="mt-1"
                    />
                  </div> */}
                  
                  {showResult ? (
                    <ReactCompareImage
                      leftImage={currentTransformation.before}
                      rightImage={currentTransformation.after}
                      leftImageLabel="Original"
                      rightImageLabel="Processed"
                      sliderLineColor="#ffffff"
                    />
                  ) : (
                    <Image
                      src={currentTransformation.before}
                      alt="Uploaded image"
                      width={600}
                      height={400}
                      className="object-cover"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {remainingCredits !== null ? `Remaining credits: ${remainingCredits}` : ""}
                </div>
                {/* <Button onClick={handleProcess} disabled={isProcessing || !uploadedFile}> */}
                <Button onClick={handleProcess} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Process Image (${currentTransformation.cost} credits)`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
