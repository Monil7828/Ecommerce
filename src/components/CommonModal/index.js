"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function CommonModal({
  modalTitle,
  mainContent,
  showButtons,
  buttonComponent,
  show,
  setShow,
  showModalTitle
}) {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShow}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl rounded-l-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {showModalTitle && (
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {modalTitle}
                          </Dialog.Title>
                        </div>
                      )}
                      <div className="mt-8">{mainContent}</div>
                    </div>
                    
                    {showButtons && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {buttonComponent}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}