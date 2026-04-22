'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface UploadResult {
  url:       string
  public_id: string
  width:     number
  height:    number
}

export function useCloudinaryUpload(folder = 'amiora/products') {
  const [uploading, setUploading] = useState(false)

  async function uploadFile(file: File): Promise<UploadResult | null> {
    setUploading(true)
    try {
      // Step 1: Get signed params from our server
      const sigRes = await fetch(`/api/upload?folder=${encodeURIComponent(folder)}`)
      if (!sigRes.ok) throw new Error('Failed to get upload signature')
      const { signature, timestamp, api_key, cloud_name } = await sigRes.json()

      // Step 2: Upload directly from browser → Cloudinary (no body size limit)
      const fd = new FormData()
      fd.append('file',      file)
      fd.append('api_key',   api_key)
      fd.append('timestamp', String(timestamp))
      fd.append('signature', signature)
      fd.append('folder',    folder)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: fd },
      )
      const data = await uploadRes.json()
      if (data.error) throw new Error(data.error.message)

      return {
        url:       data.secure_url,
        public_id: data.public_id,
        width:     data.width,
        height:    data.height,
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  async function uploadFiles(files: File[]): Promise<UploadResult[]> {
    const results: UploadResult[] = []
    for (const file of files) {
      const result = await uploadFile(file)
      if (result) results.push(result)
    }
    return results
  }

  return { uploading, uploadFile, uploadFiles }
}
